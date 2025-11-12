import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Notifications } from "../Notifications";
import { PROFILE_STATUS } from "../../../constants";

jest.mock("../hooks", () => ({
  useUserSettings: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        loading: "読み込み中",
        notificationSettings: "通知設定",
        emailNotifications: "メール通知",
        commentNotifications: "コメント通知",
        securityAlerts: "セキュリティ警告",
        saving: "保存中...",
        settingsSaved: "設定を保存しました",
        settingsSaveError: "保存に失敗しました",
      };
      return translations[key] || key;
    },
  }),
}));

const { useUserSettings } = jest.requireMock("../hooks") as {
  useUserSettings: jest.Mock;
};

describe("Notifications コンポーネント", () => {
  let updateSettingMock: jest.Mock;

  beforeEach(() => {
    updateSettingMock = jest.fn();
    jest.clearAllMocks();
  });

  it("loading 中はローディングメッセージを表示する", () => {
    useUserSettings.mockReturnValue({
      settings: {},
      updateSetting: updateSettingMock,
      loading: true,
      status: null,
    });

    render(<Notifications />);
    expect(screen.getByText("読み込み中")).toBeInTheDocument();
  });

  it("チェックボックスとタイトルが正しく表示される", () => {
    useUserSettings.mockReturnValue({
      settings: {
        emailNotifications: true,
        commentNotifications: false,
        securityAlerts: true,
      },
      updateSetting: updateSettingMock,
      loading: false,
      status: null,
    });

    render(<Notifications />);

    expect(screen.getByText("通知設定")).toBeInTheDocument();

    const emailCheckbox = screen.getByLabelText(
      "メール通知"
    ) as HTMLInputElement;
    const commentCheckbox = screen.getByLabelText(
      "コメント通知"
    ) as HTMLInputElement;
    const securityCheckbox = screen.getByLabelText(
      "セキュリティ警告"
    ) as HTMLInputElement;

    expect(emailCheckbox.checked).toBe(true);
    expect(commentCheckbox.checked).toBe(false);
    expect(securityCheckbox.checked).toBe(true);
  });

  it("チェックボックス変更時に updateSetting が呼ばれる", () => {
    useUserSettings.mockReturnValue({
      settings: {
        emailNotifications: false,
        commentNotifications: false,
        securityAlerts: false,
      },
      updateSetting: updateSettingMock,
      loading: false,
      status: null,
    });

    render(<Notifications />);

    const emailCheckbox = screen.getByLabelText(
      "メール通知"
    ) as HTMLInputElement;
    fireEvent.click(emailCheckbox);
    expect(updateSettingMock).toHaveBeenCalledWith("emailNotifications", true);

    const commentCheckbox = screen.getByLabelText(
      "コメント通知"
    ) as HTMLInputElement;
    fireEvent.click(commentCheckbox);
    expect(updateSettingMock).toHaveBeenCalledWith(
      "commentNotifications",
      true
    );

    const securityCheckbox = screen.getByLabelText(
      "セキュリティ警告"
    ) as HTMLInputElement;
    fireEvent.click(securityCheckbox);
    expect(updateSettingMock).toHaveBeenCalledWith("securityAlerts", true);
  });

  it("status が SAVING の場合は保存中メッセージを表示する", () => {
    useUserSettings.mockReturnValue({
      settings: {},
      updateSetting: updateSettingMock,
      loading: false,
      status: PROFILE_STATUS.SAVING,
    });

    render(<Notifications />);
    expect(screen.getByText("保存中...")).toBeInTheDocument();
  });

  it("status が SUCCESS の場合は保存成功メッセージを表示する", () => {
    useUserSettings.mockReturnValue({
      settings: {},
      updateSetting: updateSettingMock,
      loading: false,
      status: PROFILE_STATUS.SUCCESS,
    });

    render(<Notifications />);
    expect(screen.getByText("設定を保存しました")).toBeInTheDocument();
  });

  it("status が ERROR の場合は保存失敗メッセージを表示する", () => {
    useUserSettings.mockReturnValue({
      settings: {},
      updateSetting: updateSettingMock,
      loading: false,
      status: PROFILE_STATUS.ERROR,
    });

    render(<Notifications />);
    expect(screen.getByText("保存に失敗しました")).toBeInTheDocument();
  });
});
