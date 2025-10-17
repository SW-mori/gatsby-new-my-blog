import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Layout } from "../Layout";

jest.mock("gatsby", () => {
  const originalModule = jest.requireActual("gatsby");
  return {
    __esModule: true,
    ...originalModule,
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
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

describe("Layoutコンポーネント", () => {
  it("ヘッダーのタイトルとナビリンクが正しく表示される", () => {
    render(<Layout pageTitle="ページタイトル">本文</Layout>);

    expect(screen.getByText("My Gatsby Site")).toBeInTheDocument();

    expect(screen.getByText("ホーム画面へようこそ")).toHaveAttribute(
      "href",
      "/"
    );

    expect(screen.getByText("画像最適化ページ")).toHaveAttribute(
      "href",
      "/images"
    );
    expect(screen.getByText("Posts")).toHaveAttribute("href", "/posts");

    expect(screen.getByText("JA")).toHaveAttribute("href", "/");
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
