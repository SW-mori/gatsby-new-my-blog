import { render, screen, fireEvent } from "@testing-library/react";
import { Dashboard } from "../Dashboard";
import { useAuth } from "../../../context";

jest.mock("../../../context", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("Dashboard Component", () => {
  const mockUseAuth = useAuth as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("🔄 ローディング中の表示", () => {
    mockUseAuth.mockReturnValue({
      loading: true,
      user: null,
      error: null,
      logout: jest.fn(),
    });

    render(<Dashboard />);
    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  test("⚠️ エラー表示とリロードボタン動作", () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      user: null,
      error: "認証エラーが発生しました",
      logout: jest.fn(),
    });

    render(<Dashboard />);

    expect(screen.getByText("errorTitle")).toBeInTheDocument();
    expect(screen.getByText("認証エラーが発生しました")).toBeInTheDocument();

    // reloadボタン動作確認
    const reloadSpy = jest
      .spyOn(window.location, "reload")
      .mockImplementation(() => {});
    fireEvent.click(screen.getByText("reload"));
    expect(reloadSpy).toHaveBeenCalled();
  });

  test("👤 ユーザーがいない場合の表示", () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      user: null,
      error: null,
      logout: jest.fn(),
    });

    render(<Dashboard />);
    expect(screen.getByText("dashboard")).toBeInTheDocument();
    expect(screen.getByText("noUser")).toBeInTheDocument();
  });

  test("✅ ユーザー情報がある場合の表示", () => {
    const mockLogout = jest.fn();
    const mockUser = {
      uid: "user123",
      email: "test@example.com",
      metadata: {
        creationTime: "2024-01-01T10:00:00Z",
        lastSignInTime: "2024-06-01T15:00:00Z",
      },
    };

    mockUseAuth.mockReturnValue({
      loading: false,
      user: mockUser,
      error: null,
      logout: mockLogout,
    });

    render(<Dashboard />);

    expect(screen.getByText("dashboard")).toBeInTheDocument();
    expect(screen.getByText("UID:")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("logout")).toBeInTheDocument();

    fireEvent.click(screen.getByText("logout"));
    expect(mockLogout).toHaveBeenCalled();
  });
});
