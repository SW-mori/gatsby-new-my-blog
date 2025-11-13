import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Header } from "../Header";
import { useHeader } from "../hooks";

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

const mockedUseHeader = useHeader as jest.Mock;

describe("Header コンポーネント", () => {
  afterEach(() => jest.clearAllMocks());

  it("ロード中は loading 表示", () => {
    mockedUseHeader.mockReturnValue({
      getPathForLanguage: jest.fn(),
      handleLogout: jest.fn(),
      isAuthenticated: false,
      language: "ja",
      loading: true,
    });

    render(<Header />);
    const header = screen.getByRole("banner");
    expect(within(header).getAllByText("読み込み中")[0]).toBeInTheDocument();
  });

  it("未ログイン時はログイン・新規登録リンクが表示される", () => {
    mockedUseHeader.mockReturnValue({
      getPathForLanguage: (lng: string) => (lng === "ja" ? "/" : "/en"),
      handleLogout: jest.fn(),
      isAuthenticated: false,
      language: "ja",
      loading: false,
    });

    render(<Header />);
    const header = screen.getByRole("banner");
    const nav = within(header).getByRole("navigation");

    expect(within(header).getByText("ホーム")).toHaveAttribute("href", "/");
    expect(within(nav).getByText("ログイン")).toHaveAttribute("href", "/login");
    expect(within(nav).getByText("resister")).toHaveAttribute(
      "href",
      "/signup"
    );
  });

  it("ログイン済みの場合はダッシュボードなどのリンクとログアウトボタンが表示される", () => {
    const handleLogoutMock = jest.fn();

    mockedUseHeader.mockReturnValue({
      getPathForLanguage: (lng: string) => (lng === "ja" ? "/" : "/en"),
      handleLogout: handleLogoutMock,
      isAuthenticated: true,
      language: "ja",
      loading: false,
    });

    render(<Header />);
    const header = screen.getByRole("banner");
    const nav = within(header).getByRole("navigation");

    expect(within(nav).getByText("ダッシュボード")).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(within(nav).getByText("投稿一覧")).toHaveAttribute("href", "/posts");
    expect(within(nav).getByText("エラーログ")).toHaveAttribute(
      "href",
      "/error-logs"
    );
    expect(within(nav).getByText("設定")).toHaveAttribute("href", "/settings");

    const logoutButton = within(nav).getByText("ログアウト");
    fireEvent.click(logoutButton);
    expect(handleLogoutMock).toHaveBeenCalled();
  });

  it("言語切替リンクが正しく表示される", () => {
    mockedUseHeader.mockReturnValue({
      getPathForLanguage: (lng: string) => (lng === "ja" ? "/" : "/en"),
      handleLogout: jest.fn(),
      isAuthenticated: false,
      language: "ja",
      loading: false,
    });

    render(<Header />);
    const header = screen.getByRole("banner");
    const nav = within(header).getByRole("navigation");

    const jaElement = within(nav).getByText("JA");
    expect(jaElement.tagName).toBe("SPAN");
    const enElement = within(nav).getByText("EN");
    expect(enElement.tagName).toBe("A");
    expect(enElement).toHaveAttribute("href", "/en");
  });
});
