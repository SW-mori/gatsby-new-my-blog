import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UpdatePassword } from "../UpdatePassword";

jest.mock("../../../../../context", () => ({
  useAuth: () => ({
    user: { email: "test@example.com" },
    updatePasswordSecure: jest.fn(),
    reauthenticate: jest.fn(),
  }),
}));

jest.mock("../../../../Reauthenticate", () => ({
  Reauthenticate: ({ onSuccess }: { onSuccess: () => void }) => (
    <div data-testid="reauth">{JSON.stringify({ onSuccess })}</div>
  ),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

describe("UpdatePassword コンポーネント", () => {
  let updatePasswordSecureMock: jest.Mock;

  beforeEach(() => {
    updatePasswordSecureMock = jest.fn();
    jest.spyOn(require("../../../../../context"), "useAuth").mockReturnValue({
      user: { email: "test@example.com" },
      updatePasswordSecure: updatePasswordSecureMock,
      reauthenticate: jest.fn(),
    });
  });

  it("フォーム要素が正しく表示される", () => {
    render(<UpdatePassword />);

    expect(screen.getByPlaceholderText("currentPassword")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("newPassword")).toBeInTheDocument();
    expect(screen.getByText("save")).toBeInTheDocument();
  });

  it("フォーム送信で updatePasswordSecure が成功した場合は成功表示", async () => {
    updatePasswordSecureMock.mockResolvedValue(true);

    render(<UpdatePassword />);

    fireEvent.change(screen.getByPlaceholderText("currentPassword"), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByPlaceholderText("newPassword"), {
      target: { value: "newpass" },
    });

    fireEvent.click(screen.getByText("save"));

    await waitFor(() => {
      expect(updatePasswordSecureMock).toHaveBeenCalledWith(
        "oldpass",
        "newpass"
      );
      expect(screen.getByText("saved")).toBeInTheDocument();
    });
  });

  it("フォーム送信で updatePasswordSecure が失敗した場合は Reauthenticate を表示", async () => {
    updatePasswordSecureMock.mockResolvedValue(false);

    render(<UpdatePassword />);

    fireEvent.change(screen.getByPlaceholderText("currentPassword"), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByPlaceholderText("newPassword"), {
      target: { value: "newpass" },
    });

    fireEvent.click(screen.getByText("save"));

    await waitFor(() => {
      expect(updatePasswordSecureMock).toHaveBeenCalledWith(
        "oldpass",
        "newpass"
      );
      expect(screen.getByTestId("reauth")).toBeInTheDocument();
    });
  });

  it("フォーム送信で updatePasswordSecure が例外を投げた場合はエラー表示", async () => {
    updatePasswordSecureMock.mockRejectedValue(new Error("fail"));

    render(<UpdatePassword />);

    fireEvent.change(screen.getByPlaceholderText("currentPassword"), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByPlaceholderText("newPassword"), {
      target: { value: "newpass" },
    });

    fireEvent.click(screen.getByText("save"));

    await waitFor(() => {
      expect(updatePasswordSecureMock).toHaveBeenCalledWith(
        "oldpass",
        "newpass"
      );
      expect(screen.getByText("passwordUpdateFailed")).toBeInTheDocument();
    });
  });
});
