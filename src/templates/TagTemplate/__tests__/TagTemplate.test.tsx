import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PageProps } from "gatsby";
import TagTemplate from "../TagTemplate";
import { AllContentfulPostQuery } from "types";

jest.mock("../../../components", () => ({
  __esModule: true,
  Layout: ({ children, pageTitle }: any) => (
    <div>
      <h1>{pageTitle}</h1>
      {children}
    </div>
  ),
  SEO: ({ title, description, pathname }: any) => (
    <div data-testid="seo">
      <span>{title}</span>
      <span>{description}</span>
      <span>{pathname}</span>
    </div>
  ),
  PostCard: ({ post }: any) => <div data-testid="post">{post.title}</div>,
}));

jest.mock("gatsby-plugin-react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: any) => {
      const translations: Record<string, string> = {
        tag: "Tag",
        posts: "Posts",
        tag_posts_description: `Posts for tag ${opts?.tag}`,
        no_posts_for_tag: `No posts for tag ${opts?.tag}`,
        back_to_posts: "Back to posts",
      };
      return translations[key] || key;
    },
  }),
}));

describe("TagTemplate コンポーネント", () => {
  const mockPosts = [
    {
      id: "1",
      title: "React記事",
      slug: "react-post",
      date: "2025/10/17",
      tags: ["React"],
    },
    {
      id: "2",
      title: "Gatsby記事",
      slug: "gatsby-post",
      date: "2025/10/16",
      tags: ["Gatsby"],
    },
  ];

  const mockData: AllContentfulPostQuery = {
    allContentfulGatsbyBlog: { nodes: mockPosts },
  };

  const mockPageContext = { tag: "React" };

  const mockLocation: PageProps["location"] = {
    pathname: "/tags/React",
    search: "",
    hash: "",
    state: null,
    key: "test",
    ancestorOrigins: [] as any,
    assign: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    origin: "",
    host: "",
    hostname: "",
    href: "",
    port: "",
    protocol: "",
  };

  const mockProps: PageProps<AllContentfulPostQuery, { tag: string }> = {
    data: mockData,
    pageContext: mockPageContext,
    path: "/tags/React",
    location: mockLocation,
    params: {},
    uri: "/tags/React",
    children: undefined,
    pageResources: {} as any,
    serverData: {},
  };

  it("SEO とタグタイトルが表示される", () => {
    render(<TagTemplate {...mockProps} />);
    const seo = screen.getByTestId("seo");

    expect(seo).toHaveTextContent("Tag: React - Posts");
    expect(seo).toHaveTextContent("Posts for tag React");
    expect(seo).toHaveTextContent("/tags/React");

    expect(screen.getByText("Tag: React")).toBeInTheDocument();
  });

  it("該当タグの投稿が表示される", () => {
    render(<TagTemplate {...mockProps} />);
    expect(screen.getByText("React記事")).toBeInTheDocument();
    expect(screen.getByText("Gatsby記事")).toBeInTheDocument();
  });

  it("該当投稿がない場合、メッセージが表示される", () => {
    const noPostsData: AllContentfulPostQuery = {
      allContentfulGatsbyBlog: { nodes: [] },
    };
    render(<TagTemplate {...mockProps} data={noPostsData} />);
    expect(screen.getByText("No posts for tag React")).toBeInTheDocument();
  });

  it("投稿一覧リンクが表示される", () => {
    render(<TagTemplate {...mockProps} />);
    const link = screen.getByText("← Back to posts");
    expect(link).toHaveAttribute("href", "/posts");
  });
});
