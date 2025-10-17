import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomeTemplate from "../HomeTemplate";

jest.mock("../../../components", () => ({
  __esModule: true,
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SEO: ({ title, description, pathname }: any) => (
    <div data-testid="seo">
      <span>{title}</span>
      <span>{description}</span>
      <span>{pathname}</span>
    </div>
  ),
}));

jest.mock("gatsby-plugin-react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        seo_home_title: "ホームページ",
        seo_home_description: "Gatsby サイトのトップページです",
        home: "ホーム画面へようこそ",
      };
      return translations[key] || key;
    },
  }),
}));

describe("HomeTemplate コンポーネント", () => {
  it("SEO とイントロ文が正しくレンダリングされる", () => {
    render(<HomeTemplate />);

    const seo = screen.getByTestId("seo");
    expect(seo).toHaveTextContent("ホームページ");
    expect(seo).toHaveTextContent("Gatsby サイトのトップページです");
    expect(seo).toHaveTextContent("/");

    expect(screen.getByText("ホーム画面へようこそ")).toBeInTheDocument();
  });
});
