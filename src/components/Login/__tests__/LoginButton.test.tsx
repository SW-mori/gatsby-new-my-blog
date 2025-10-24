import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoginButton } from "../LoginButton";
import {
  getCurrentUser,
  initIdentity,
  login,
  logout,
  onLogin,
  onLogout,
} from "../../../utils";

jest.mock("../../../utils", () => ({
  getCurrentUser: jest.fn(),
  initIdentity: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  onLogin: jest.fn(),
  onLogout: jest.fn(),
}));

describe("LoginButton コンポーネント", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("非ログイン状態ではログインボタンが表示される", () => {
    (getCurrentUser as jest.Mock).mockReturnValue(null);

    render(<LoginButton />);

    expect(initIdentity).toHaveBeenCalled();
    expect(screen.getByText("ログイン")).toBeInTheDocument();

    fireEvent.click(screen.getByText("ログイン"));
    expect(login).toHaveBeenCalled();
  });

  it("ログイン状態ではユーザー名とログアウトボタンが表示される", () => {
    const mockUser = {
      user_metadata: { full_name: "Taro Yamada" },
      email: "taro@example.com",
    };
    (getCurrentUser as jest.Mock).mockReturnValue(mockUser);

    render(<LoginButton />);

    expect(screen.getByText("こんにちは、Taro Yamada")).toBeInTheDocument();

    fireEvent.click(screen.getByText("ログアウト"));
    expect(logout).toHaveBeenCalled();
  });

  it("ユーザー名がない場合は email を表示する", () => {
    const mockUser = {
      user_metadata: {},
      email: "taro@example.com",
    };
    (getCurrentUser as jest.Mock).mockReturnValue(mockUser);

    render(<LoginButton />);

    expect(
      screen.getByText("こんにちは、taro@example.com")
    ).toBeInTheDocument();
  });

  it("onLogin と onLogout のコールバックが設定される", () => {
    (getCurrentUser as jest.Mock).mockReturnValue(null);

    render(<LoginButton />);

    expect(onLogin).toHaveBeenCalled();
    expect(onLogout).toHaveBeenCalled();
  });
});
