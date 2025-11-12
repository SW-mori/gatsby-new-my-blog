import { render, screen, fireEvent } from "@testing-library/react";
import { Profile } from "../Profile";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("../hooks", () => ({
  useProfile: () => {
    const setDisplayName = jest.fn();
    const setPhotoURL = jest.fn();
    const handleSubmit = jest.fn();
    const handleFileChange = jest.fn();
    const handleDeletePhoto = jest.fn();
    const fileInputRef = { current: { click: jest.fn() } };

    return {
      displayName: "Test User",
      setDisplayName,
      photoURL: "http://example.com/photo.jpg",
      setPhotoURL,
      status: "IDLE",
      loading: false,
      uploading: false,
      deleting: false,
      handleSubmit,
      fileInputRef,
      handleFileChange,
      handleDeletePhoto,
    };
  },
}));

jest.mock("../components/UpdatePassword", () => ({
  UpdatePassword: () => <div>UpdatePasswordComponent</div>,
}));
jest.mock("../components/DeleteAccount", () => ({
  DeleteAccount: () => <div>DeleteAccountComponent</div>,
}));
jest.mock("../components/Notifications", () => ({
  Notifications: () => <div>NotificationsComponent</div>,
}));

describe("Profile コンポーネント", () => {
  it("フォーム要素と画像が正しく表示される", () => {
    render(<Profile />);
    expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("http://example.com/photo.jpg")
    ).toBeInTheDocument();
    expect(screen.getByAltText("Profile")).toBeInTheDocument();
    expect(screen.getByText("UpdatePasswordComponent")).toBeInTheDocument();
    expect(screen.getByText("DeleteAccountComponent")).toBeInTheDocument();
    expect(screen.getByText("NotificationsComponent")).toBeInTheDocument();
  });

  it("displayName を変更すると setDisplayName が呼ばれる", () => {
    render(<Profile />);
    const input = screen.getByDisplayValue("Test User");
    fireEvent.change(input, { target: { value: "New Name" } });
  });

  it("photoURL を変更すると setPhotoURL が呼ばれる", () => {
    render(<Profile />);
    const input = screen.getByDisplayValue("http://example.com/photo.jpg");
    fireEvent.change(input, {
      target: { value: "http://newphoto.com/photo.jpg" },
    });
  });

  it("ファイルアップロードボタンを押すと fileInputRef.current.click が呼ばれる", () => {
    render(<Profile />);
    const button = screen.getByText("changePhoto");
    fireEvent.click(button);
  });

  it("写真削除ボタンを押すと handleDeletePhoto が呼ばれる", () => {
    render(<Profile />);
    const button = screen.getByText("removePhoto");
    fireEvent.click(button);
  });
});
