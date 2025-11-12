import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Header } from "../Header";

jest.mock("../../../constants", () => ({
  LANGUAGES: {
    JA: "ja",
    EN: "en",
  },
}));

jest.mock("gatsby-plugin-react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        home: "ホーム",
        loading: "読み込み中",
        dashboard: "ダッシュボード",
        posts: "投稿一覧",
        errorLogs: "エラーログ",
        settings: "設定",
        logout: "ログアウト",
        login: "ログイン",
        signup: "新規登録",
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock("../hooks", () => ({
  useHeader: jest.fn(),
}));

const { useHeader } = jest.requireMock("../hooks");

describe("Header コンポーネント", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ロード中は loading 表示", () => {
    useHeader.mockReturnValue({
      getPathForLanguage: jest.fn(),
      handleLogout: jest.fn(),
      isAuthenticated: false,
      language: "ja",
      loading: true,
    });

    render(<Header />);
    expect(screen.getByText("読み込み中")).toBeInTheDocument();
  });

  it("未ログイン時はログイン・新規登録リンクが表示される", () => {
    useHeader.mockReturnValue({
      getPathForLanguage: (lng: string) => (lng === "ja" ? "/" : "/en"),
      handleLogout: jest.fn(),
      isAuthenticated: false,
      language: "ja",
      loading: false,
    });

    render(<Header />);
    expect(screen.getByText("ログイン")).toHaveAttribute("href", "/login");
    expect(screen.getByText("新規登録")).toHaveAttribute("href", "/signup");
    expect(screen.getByText("ホーム")).toHaveAttribute("href", "/");
  });

  it("ログイン済みの場合はダッシュボードなどのリンクとログアウトボタンが表示される", () => {
    const handleLogoutMock = jest.fn();

    useHeader.mockReturnValue({
      getPathForLanguage: (lng: string) => (lng === "ja" ? "/" : "/en"),
      handleLogout: handleLogoutMock,
      isAuthenticated: true,
      language: "ja",
      loading: false,
    });

    render(<Header />);

    expect(screen.getByText("ダッシュボード")).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.getByText("投稿一覧")).toHaveAttribute("href", "/posts");
    expect(screen.getByText("エラーログ")).toHaveAttribute(
      "href",
      "/error-logs"
    );
    expect(screen.getByText("設定")).toHaveAttribute("href", "/settings");

    const logoutButton = screen.getByText("ログアウト");
    fireEvent.click(logoutButton);
    expect(handleLogoutMock).toHaveBeenCalled();
  });

  it("言語切替リンクが正しく表示される", () => {
    useHeader.mockReturnValue({
      getPathForLanguage: (lng: string) => (lng === "ja" ? "/" : "/en"),
      handleLogout: jest.fn(),
      isAuthenticated: false,
      language: "ja",
      loading: false,
    });

    render(<Header />);

    const jaElement = screen.getByText("JA");
    expect(jaElement.tagName).toBe("SPAN");
    const enElement = screen.getByText("EN");
    expect(enElement.tagName).toBe("A");
    expect(enElement).toHaveAttribute("href", "/en");
  });
});
