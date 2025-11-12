import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NotificationSettings } from "../NotificationSettings";

jest.mock("../hooks", () => ({
  useNotificationSettings: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        loading: "読み込み中",
        errorNotificationSettings: "エラー通知の設定",
        selectErrorLevelsToNotify: "通知するエラーレベルを選択してください",
        error: "エラー",
        warning: "警告",
        info: "情報",
      };
      return translations[key] || key;
    },
  }),
}));

const { useNotificationSettings } = jest.requireMock("../hooks") as {
  useNotificationSettings: jest.Mock;
};

describe("NotificationSettings コンポーネント", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loading 中は読み込みメッセージを表示する", () => {
    useNotificationSettings.mockReturnValue({
      settings: { notificationLevel: [] },
      loading: true,
      handleChange: jest.fn(),
    });

    render(<NotificationSettings />);

    expect(screen.getByText("読み込み中")).toBeInTheDocument();
  });

  it("設定内容が正しく表示される", () => {
    useNotificationSettings.mockReturnValue({
      settings: { notificationLevel: ["error", "info"] },
      loading: false,
      handleChange: jest.fn(),
    });

    render(<NotificationSettings />);

    expect(screen.getByText("エラー通知の設定")).toBeInTheDocument();
    expect(
      screen.getByText("通知するエラーレベルを選択してください")
    ).toBeInTheDocument();

    const errorCheckbox = screen.getByLabelText("エラー") as HTMLInputElement;
    const warningCheckbox = screen.getByLabelText("警告") as HTMLInputElement;
    const infoCheckbox = screen.getByLabelText("情報") as HTMLInputElement;

    expect(errorCheckbox.checked).toBe(true);
    expect(warningCheckbox.checked).toBe(false);
    expect(infoCheckbox.checked).toBe(true);
  });

  it("チェックボックスをクリックすると handleChange が呼ばれる", () => {
    const handleChangeMock = jest.fn();

    useNotificationSettings.mockReturnValue({
      settings: { notificationLevel: ["error", "info"] },
      loading: false,
      handleChange: handleChangeMock,
    });

    render(<NotificationSettings />);

    const warningCheckbox = screen.getByLabelText("警告");
    fireEvent.click(warningCheckbox);

    expect(handleChangeMock).toHaveBeenCalledWith("warning");
  });
});
