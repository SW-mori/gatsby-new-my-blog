import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PrivateRoute } from "../PrivateRoute";
import { navigate } from "gatsby";

jest.mock("gatsby", () => ({
  navigate: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => (key === "loading" ? "読み込み中" : key),
  }),
}));

jest.mock("../../../context", () => ({
  useAuth: jest.fn(),
}));

const { useAuth } = jest.requireMock("../../../context") as {
  useAuth: jest.Mock;
};

describe("PrivateRoute コンポーネント", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loading 中は読み込みメッセージを表示する", () => {
    useAuth.mockReturnValue({ user: null, loading: true });

    render(<PrivateRoute>子要素</PrivateRoute>);

    expect(screen.getByText("読み込み中")).toBeInTheDocument();
  });

  it("user がいない場合は /login にリダイレクトされる", () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    render(<PrivateRoute>子要素</PrivateRoute>);

    expect(navigate).toHaveBeenCalledWith("/login");
    expect(screen.queryByText("子要素")).not.toBeInTheDocument();
  });

  it("user が存在する場合は子要素を表示する", () => {
    useAuth.mockReturnValue({
      user: { uid: "123", email: "test@example.com" },
      loading: false,
    });

    render(
      <PrivateRoute>
        <div>保護されたページ</div>
      </PrivateRoute>
    );

    expect(screen.getByText("保護されたページ")).toBeInTheDocument();
  });
});
