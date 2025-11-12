import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Dashboard } from "../Dashboard";

// --- i18n モック ---
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        loading: "読み込み中...",
        errorTitle: "エラーが発生しました",
        reload: "再読み込み",
        dashboard: "ダッシュボード",
        noUser: "ユーザー情報がありません",
        email: "メールアドレス",
        createdAt: "作成日時",
        lastLogin: "最終ログイン",
        logout: "ログアウト",
      };
      return translations[key] || key;
    },
  }),
}));

// --- useAuth モック ---
jest.mock("../../../context", () => ({
  useAuth: jest.fn(),
}));

const { useAuth } = jest.requireMock("../../../context");

describe("Dashboard コンポーネント", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("loading 中はローディングメッセージを表示する", () => {
    useAuth.mockReturnValue({
      loading: true,
      error: null,
      user: null,
      logout: jest.fn(),
    });
    render(<Dashboard />);
    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  it("エラー時はエラーメッセージと再読み込みボタンを表示する", () => {
    useAuth.mockReturnValue({
      loading: false,
      error: "サーバーエラー",
      user: null,
      logout: jest.fn(),
    });

    const reloadMock = jest.fn();
    render(<Dashboard reloadFn={reloadMock} />); // テスト用関数を注入

    expect(screen.getByText("エラーが発生しました")).toBeInTheDocument();
    expect(screen.getByText("サーバーエラー")).toBeInTheDocument();

    const reloadButton = screen.getByText("再読み込み");
    fireEvent.click(reloadButton);
    expect(reloadMock).toHaveBeenCalled(); // 安全に確認可能
  });

  it("未ログイン時はユーザー情報なしメッセージを表示する", () => {
    useAuth.mockReturnValue({
      loading: false,
      error: null,
      user: null,
      logout: jest.fn(),
    });

    render(<Dashboard />);
    expect(screen.getByText("ダッシュボード")).toBeInTheDocument();
    expect(screen.getByText("ユーザー情報がありません")).toBeInTheDocument();
  });

  it("ログイン済み時はユーザー情報とログアウトボタンを表示する", () => {
    const mockLogout = jest.fn();

    useAuth.mockReturnValue({
      loading: false,
      error: null,
      user: {
        uid: "abc123",
        email: "test@example.com",
        metadata: {
          creationTime: "2025-01-01T00:00:00Z",
          lastSignInTime: "2025-11-10T00:00:00Z",
        },
      },
      logout: mockLogout,
    });

    render(<Dashboard />);

    expect(screen.getByText("ダッシュボード")).toBeInTheDocument();
    expect(screen.getByText("UID:")).toBeInTheDocument();
    expect(screen.getByText("abc123")).toBeInTheDocument();
    expect(screen.getByText("メールアドレス:")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("作成日時:")).toBeInTheDocument();
    expect(screen.getByText("最終ログイン:")).toBeInTheDocument();

    const logoutButton = screen.getByText("ログアウト");
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });

  it("ユーザーメタデータがない場合は N/A を表示する", () => {
    useAuth.mockReturnValue({
      loading: false,
      error: null,
      user: { uid: "abc123", email: "test@example.com", metadata: null },
      logout: jest.fn(),
    });

    render(<Dashboard />);

    const naElements = screen.getAllByText("N/A");
    expect(naElements.length).toBe(2);
  });
});
