import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DeleteAccount } from "../DeleteAccount";

jest.mock("../../../../../context", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        deleteAccount: "アカウント削除",
        deleteWarning: "この操作は取り消せません",
        deleteConfirmError: "DELETEと入力してください",
        delete: "削除",
        deleting: "削除中...",
        deleted: "削除済み",
        accountDeleted: "アカウントを削除しました",
        deleteAccountFailed: "削除に失敗しました",
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock("../../../../Reauthenticate", () => ({
  Reauthenticate: ({ onSuccess }: any) => (
    <div data-testid="reauthenticate">
      <button onClick={onSuccess}>再認証完了</button>
    </div>
  ),
}));

const { useAuth } = jest.requireMock("../../../../../context") as {
  useAuth: jest.Mock;
};

describe("DeleteAccount コンポーネント", () => {
  let deleteUserAccountMock: jest.Mock;

  beforeEach(() => {
    deleteUserAccountMock = jest.fn();
    useAuth.mockReturnValue({ deleteUserAccount: deleteUserAccountMock });
    jest.clearAllMocks();
  });

  it("初期表示でタイトル・警告文・入力欄・ボタンが表示される", () => {
    render(<DeleteAccount />);

    expect(screen.getByText("アカウント削除")).toBeInTheDocument();
    expect(screen.getByText("この操作は取り消せません")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("DELETEと入力してください。")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "削除" })).toBeInTheDocument();
  });

  it("DELETE と入力しない場合はエラーを表示する", async () => {
    render(<DeleteAccount />);

    fireEvent.change(
      screen.getByPlaceholderText("DELETEと入力してください。"),
      {
        target: { value: "WRONG" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    expect(
      await screen.findByText("DELETEと入力してください")
    ).toBeInTheDocument();
  });

  it("削除成功時は成功メッセージを表示する", async () => {
    deleteUserAccountMock.mockResolvedValue(true);

    render(<DeleteAccount />);

    fireEvent.change(
      screen.getByPlaceholderText("DELETEと入力してください。"),
      {
        target: { value: "DELETE" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    expect(screen.getByRole("button")).toHaveTextContent("削除中...");

    await waitFor(() => {
      expect(screen.getByText("アカウントを削除しました")).toBeInTheDocument();
      expect(screen.getByRole("button")).toHaveTextContent("削除済み");
    });
  });

  it("再認証が必要な場合は Reauthenticate コンポーネントを表示する", async () => {
    deleteUserAccountMock.mockResolvedValue(false);

    render(<DeleteAccount />);

    fireEvent.change(
      screen.getByPlaceholderText("DELETEと入力してください。"),
      {
        target: { value: "DELETE" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    await waitFor(() => {
      expect(screen.getByTestId("reauthenticate")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("再認証完了"));
    await waitFor(() => {
      expect(screen.queryByTestId("reauthenticate")).not.toBeInTheDocument();
    });
  });

  it("削除処理中はボタンが無効化される", async () => {
    let resolveFn: (value: boolean) => void;
    deleteUserAccountMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFn = resolve;
        })
    );

    render(<DeleteAccount />);

    fireEvent.change(
      screen.getByPlaceholderText("DELETEと入力してください。"),
      {
        target: { value: "DELETE" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveTextContent("削除中...");

    resolveFn!(true);
    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("削除済み");
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  it("削除処理が例外を投げた場合はエラーメッセージを表示する", async () => {
    deleteUserAccountMock.mockRejectedValue(new Error("fail"));

    render(<DeleteAccount />);

    fireEvent.change(
      screen.getByPlaceholderText("DELETEと入力してください。"),
      {
        target: { value: "DELETE" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    await waitFor(() => {
      expect(screen.getByText("削除に失敗しました")).toBeInTheDocument();
    });
  });
});
