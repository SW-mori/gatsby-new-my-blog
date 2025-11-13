import { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Layout } from "../Layout";

jest.mock("gatsby", () => {
  const originalModule = jest.requireActual("gatsby");
  return {
    __esModule: true,
    ...originalModule,
    Link: ({ to, children }: { to: string; children: ReactNode }) => (
      <a href={to}>{children}</a>
    ),
  };
});

jest.mock("gatsby-plugin-react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        site_name: "My Gatsby Site",
        home: "ホーム画面へようこそ",
        images_page: "画像最適化ページ",
        posts: "Posts",
        dashboard: "Dashboard",
        settings: "Settings",
        logout: "Logout",
        errorLogs: "Error Logs",
        login: "Login",
      };
      return translations[key] || key;
    },
  }),
  useI18next: () => ({
    language: "en",
    originalPath: "/",
    languages: ["en", "ja"],
  }),
}));

jest.mock("../../Header/hooks", () => ({
  useHeader: () => ({
    getPathForLanguage: (lng: string) => (lng === "ja" ? "/" : "/en/"),
    handleLogout: jest.fn(),
    isAuthenticated: true,
    language: "en",
    loading: false,
  }),
}));

describe("Layoutコンポーネント", () => {
  it("ヘッダーとナビリンクが正しく表示される", () => {
    render(<Layout pageTitle="ページタイトル">本文</Layout>);

    const homeLink = screen.getByText("ホーム画面へようこそ");
    expect(homeLink).toHaveAttribute("href", "/");

    const headerNav = screen.getByRole("navigation");

    const dashboardLink = within(headerNav).getByText("Dashboard");
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");

    const postsLink = within(headerNav).getByText("Posts");
    expect(postsLink).toHaveAttribute("href", "/posts");

    const errorLogsLink = within(headerNav).getByText("Error Logs");
    expect(errorLogsLink).toHaveAttribute("href", "/error-logs");

    const settingsLink = within(headerNav).getByText("Settings");
    expect(settingsLink).toHaveAttribute("href", "/settings");

    const langLink = within(headerNav).getByText("JA");
    expect(langLink).toHaveAttribute("href", "/");

    const logoutButton = within(headerNav).getByText("Logout");
    expect(logoutButton).toBeInTheDocument();
  });

  it("pageTitle と children が main に表示される", () => {
    render(<Layout pageTitle="ページタイトル">本文</Layout>);

    expect(screen.getByText("ページタイトル")).toBeInTheDocument();
    expect(screen.getByText("本文")).toBeInTheDocument();
  });

  it("フッターにサイト名と今年の年が表示される", () => {
    render(<Layout pageTitle="ページタイトル">本文</Layout>);

    const footer = screen.getByText(
      new RegExp(`© ${new Date().getFullYear()} My Gatsby Site`)
    );
    expect(footer).toBeInTheDocument();
  });
});
