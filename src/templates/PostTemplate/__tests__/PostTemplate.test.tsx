import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PageProps } from "gatsby";
import PostTemplate from "../PostTemplate";
import { ContentfulPostData } from "types";

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
}));

jest.mock("gatsby-plugin-react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        site_name: "My Blog",
        post_not_found: "Post not found",
        post_not_found_message: "The post could not be found.",
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock("@contentful/rich-text-react-renderer", () => ({
  documentToReactComponents: (doc: any) => (
    <div data-testid="rich-text">{JSON.stringify(doc)}</div>
  ),
}));

describe("PostTemplate コンポーネント", () => {
  const mockPost = {
    title: "テスト記事",
    slug: "test-post",
    date: "2025/10/17",
    body: {
      raw: JSON.stringify({
        content: [
          {
            nodeType: "paragraph",
            content: [{ value: "本文", nodeType: "text" }],
          },
        ],
      }),
    },
    tags: ["React", "Gatsby"],
  };

  const mockData: ContentfulPostData = {
    contentfulGatsbyBlog: mockPost,
  };

  const mockPageContext: {} = {};

  const mockProps: PageProps<ContentfulPostData> = {
    data: mockData,
    pageContext: mockPageContext,
    path: "/posts/test-post",
    location: {
      pathname: "/posts/test-post",
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
    },
    params: {},
    uri: "/posts/test-post",
    children: undefined,
    pageResources: {} as any,
    serverData: {},
  };

  it("SEO とタイトルが表示される", () => {
    render(<PostTemplate {...mockProps} />);

    const seo = screen.getByTestId("seo");
    expect(seo).toHaveTextContent("テスト記事 | My Blog");
    expect(seo).toHaveTextContent(mockPost.body.raw.slice(0, 120));
    expect(seo).toHaveTextContent("/posts/test-post");

    expect(screen.getByText("テスト記事")).toBeInTheDocument();
  });

  it("本文がレンダリングされる", () => {
    render(<PostTemplate {...mockProps} />);
    expect(screen.getByTestId("rich-text")).toBeInTheDocument();
    expect(screen.getByTestId("rich-text")).toHaveTextContent("本文");
  });

  it("タグが表示される", () => {
    render(<PostTemplate {...mockProps} />);
    expect(screen.getByText("#React")).toBeInTheDocument();
    expect(screen.getByText("#Gatsby")).toBeInTheDocument();
  });

  it("post が null の場合、not found が表示される", () => {
    const nullData: ContentfulPostData = { contentfulGatsbyBlog: null };
    render(<PostTemplate {...mockProps} data={nullData} />);
    expect(screen.getByText("Post not found")).toBeInTheDocument();
    expect(
      screen.getByText("The post could not be found.")
    ).toBeInTheDocument();
  });
});
