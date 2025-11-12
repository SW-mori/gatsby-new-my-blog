import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Reauthenticate } from "../Reauthenticate";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        reauthenticateTitle: "再認証が必要です",
        password: "パスワード",
        confirm: "確認",
        authenticating: "認証中...",
        reauthenticateFailed: "認証に失敗しました",
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock("../../../context", () => ({
  useAuth: jest.fn(),
}));

const { useAuth } = jest.requireMock("../../../context") as {
  useAuth: jest.Mock;
};

describe("Reauthenticate コンポーネント", () => {
  const onSuccessMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("タイトルとフォーム要素が表示される", () => {
    useAuth.mockReturnValue({
      user: { email: "test@example.com" },
      reauthenticate: jest.fn(),
    });

    render(<Reauthenticate onSuccess={onSuccessMock} />);

    expect(screen.getByText("再認証が必要です")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("パスワード")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "確認" })).toBeInTheDocument();
  });

  it("パスワード入力が正しく反映される", () => {
    useAuth.mockReturnValue({
      user: { email: "user@example.com" },
      reauthenticate: jest.fn(),
    });

    render(<Reauthenticate onSuccess={onSuccessMock} />);

    const passwordInput = screen.getByPlaceholderText(
      "パスワード"
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "mypassword" } });
    expect(passwordInput.value).toBe("mypassword");
  });

  it("再認証成功時に onSuccess が呼ばれる", async () => {
    const reauthenticateMock = jest.fn().mockResolvedValue(true);

    useAuth.mockReturnValue({
      user: { email: "success@example.com" },
      reauthenticate: reauthenticateMock,
    });

    render(<Reauthenticate onSuccess={onSuccessMock} />);

    fireEvent.change(screen.getByPlaceholderText("パスワード"), {
      target: { value: "correctpassword" },
    });

    fireEvent.submit(
      screen.getByRole("button", { name: "確認" }).closest("form")!
    );

    await waitFor(() => {
      expect(reauthenticateMock).toHaveBeenCalledWith(
        "success@example.com",
        "correctpassword"
      );
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });

  it("再認証失敗時にエラーメッセージを表示する", async () => {
    const reauthenticateMock = jest.fn().mockResolvedValue(false);

    useAuth.mockReturnValue({
      user: { email: "fail@example.com" },
      reauthenticate: reauthenticateMock,
    });

    render(<Reauthenticate onSuccess={onSuccessMock} />);

    fireEvent.change(screen.getByPlaceholderText("パスワード"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.submit(
      screen.getByRole("button", { name: "確認" }).closest("form")!
    );

    await waitFor(() => {
      expect(reauthenticateMock).toHaveBeenCalledWith(
        "fail@example.com",
        "wrongpassword"
      );
      expect(screen.getByText("認証に失敗しました")).toBeInTheDocument();
      expect(onSuccessMock).not.toHaveBeenCalled();
    });
  });

  it("ロード中はボタンが無効化され、認証中テキストが表示される", async () => {
    const reauthenticateMock = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => setTimeout(() => resolve(true), 300));
    });

    useAuth.mockReturnValue({
      user: { email: "loading@example.com" },
      reauthenticate: reauthenticateMock,
    });

    render(<Reauthenticate onSuccess={onSuccessMock} />);

    const button = screen.getByRole("button", { name: "確認" });

    fireEvent.change(screen.getByPlaceholderText("パスワード"), {
      target: { value: "test123" },
    });
    fireEvent.submit(button.closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("認証中...")).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });
});
