import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NotFound } from "../NotFound";

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

describe("NotFoundコンポーネント", () => {
  const ORIGINAL_ENV = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = ORIGINAL_ENV;
  });

  it("見出しとホームリンクが表示される", () => {
    process.env.NODE_ENV = "production";
    render(<NotFound />);

    const heading = screen.getByText("Page not found");
    expect(heading).toBeInTheDocument();

    const link = screen.getByText("Go home");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/");

    expect(screen.queryByText(/Try creating a page/)).not.toBeInTheDocument();
  });

  it("開発環境では開発用メッセージが表示される", () => {
    process.env.NODE_ENV = "development";
    render(<NotFound />);

    const devMessage = screen.getByText(/Try creating a page/);
    expect(devMessage).toBeInTheDocument();

    const codeElement = screen.getByText("src/pages/");
    expect(codeElement).toBeInTheDocument();
    expect(codeElement.tagName.toLowerCase()).toBe("code");
  });
});
