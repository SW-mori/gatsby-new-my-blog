import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Login } from "../Login";

jest.mock("../hooks", () => ({
  useLogin: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        login: "ログイン",
        email: "メールアドレス",
        password: "パスワード",
        loadingLogin: "ログイン中...",
      };
      return translations[key] || key;
    },
  }),
}));

const { useLogin } = jest.requireMock("../hooks") as {
  useLogin: jest.Mock;
};

describe("Login コンポーネント", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("フォーム要素が正しく表示される", () => {
    useLogin.mockReturnValue({
      email: "",
      password: "",
      error: "",
      loading: false,
      handleLogin: jest.fn(),
      onChange: {
        onChangeEmail: jest.fn(),
        onChangePassword: jest.fn(),
      },
    });

    render(<Login />);

    const headings = screen.getAllByText("ログイン");
    expect(headings[0].tagName).toBe("H1");

    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
  });

  it("入力変更で onChangeEmail / onChangePassword が呼ばれる", () => {
    const onChangeEmail = jest.fn();
    const onChangePassword = jest.fn();

    useLogin.mockReturnValue({
      email: "",
      password: "",
      error: "",
      loading: false,
      handleLogin: jest.fn(),
      onChange: { onChangeEmail, onChangePassword },
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "password123" },
    });

    expect(onChangeEmail).toHaveBeenCalled();
    expect(onChangePassword).toHaveBeenCalled();
  });

  it("エラーがある場合はエラーメッセージを表示する", () => {
    useLogin.mockReturnValue({
      email: "test@example.com",
      password: "123456",
      error: "無効なログイン情報です",
      loading: false,
      handleLogin: jest.fn(),
      onChange: {
        onChangeEmail: jest.fn(),
        onChangePassword: jest.fn(),
      },
    });

    render(<Login />);

    expect(screen.getByText("無効なログイン情報です")).toBeInTheDocument();
  });

  it("ローディング中はボタンが無効化される", () => {
    useLogin.mockReturnValue({
      email: "test@example.com",
      password: "123456",
      error: "",
      loading: true,
      handleLogin: jest.fn(),
      onChange: {
        onChangeEmail: jest.fn(),
        onChangePassword: jest.fn(),
      },
    });

    render(<Login />);

    const button = screen.getByRole("button", { name: "ログイン中..." });
    expect(button).toBeDisabled();
  });

  it("フォーム送信で handleLogin が呼ばれる", () => {
    const handleLoginMock = jest.fn((e) => e.preventDefault());

    useLogin.mockReturnValue({
      email: "test@example.com",
      password: "password",
      error: "",
      loading: false,
      handleLogin: handleLoginMock,
      onChange: {
        onChangeEmail: jest.fn(),
        onChangePassword: jest.fn(),
      },
    });

    const { container } = render(<Login />);

    const form = container.querySelector("form");
    expect(form).not.toBeNull();

    fireEvent.submit(form!);

    expect(handleLoginMock).toHaveBeenCalled();
  });
});
