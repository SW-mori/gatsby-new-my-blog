import React from "react";
import { render, screen } from "@testing-library/react";
import { PostCard } from "../PostCard";
import { PostCardProps } from "../types";
import "@testing-library/jest-dom";

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

describe("PostCardコンポーネント", () => {
  const post: PostCardProps["post"] = {
    id: "1",
    slug: "test-post",
    title: "テスト記事",
    date: "2025-10-17",
    tags: ["React", "Gatsby"],
  };

  it("記事タイトル、日付、タグが正しくレンダリングされる", () => {
    render(<PostCard post={post} />);

    const titleLink = screen.getByText(post.title);
    expect(titleLink).toBeInTheDocument();
    expect(titleLink.closest("a")).toHaveAttribute(
      "href",
      `/posts/${post.slug}`
    );

    const date = screen.getByText(post.date);
    expect(date).toBeInTheDocument();

    post.tags?.forEach((tag) => {
      const tagElement = screen.getByText(`#${tag}`);
      expect(tagElement).toBeInTheDocument();
    });
  });

  it("タグが空の場合、タグ要素が表示されない", () => {
    render(<PostCard post={{ ...post, tags: [] }} />);

    expect(screen.queryByText("#React")).not.toBeInTheDocument();
    expect(screen.queryByText("#Gatsby")).not.toBeInTheDocument();
  });
});
