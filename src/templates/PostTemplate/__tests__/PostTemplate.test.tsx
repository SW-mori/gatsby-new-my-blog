import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PageProps } from "gatsby";
import PostTemplate from "../PostTemplate";
import { ContentfulPostData } from "types";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";

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
  PostCard: ({ post }: any) => <div data-testid="post-card">{post.title}</div>,
}));

jest.mock("gatsby-plugin-react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        site_name: "My Blog",
        post_not_found: "Post not found",
        post_not_found_message: "The post could not be found.",
        comments: "Comments",
        contact_author: "Contact",
        name: "Name",
        email: "Email",
        message: "Message",
        send: "Send",
        form_success_message: "Message sent successfully",
        form_error_message: "Message failed to send",
        share: "Share",
        related_posts: "Related Articles",
      };
      return translations[key] || key;
    },
    i18n: { language: "ja" },
  }),
}));

jest.mock("@contentful/rich-text-react-renderer", () => ({
  documentToReactComponents: (doc: any) => (
    <div data-testid="rich-text">{doc.content[0].content[0].value}</div>
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
    id: "1",
  };

  const mockData: ContentfulPostData = {
    contentfulGatsbyBlog: mockPost,
    allContentfulGatsbyBlog: { nodes: [mockPost] },
  };

  const mockProps: PageProps<ContentfulPostData> = {
    data: mockData,
    pageContext: {},
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

    const parsedBody = JSON.parse(mockPost.body.raw);
    const plainText = documentToPlainTextString(parsedBody).slice(0, 120);

    expect(seo).toHaveTextContent("テスト記事 | My Blog");
    expect(seo).toHaveTextContent(plainText);
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
    const nullData: ContentfulPostData = {
      contentfulGatsbyBlog: null,
      allContentfulGatsbyBlog: { nodes: [] },
    };
    render(<PostTemplate {...mockProps} data={nullData} />);
    expect(screen.getByText("Post not found")).toBeInTheDocument();
    expect(
      screen.getByText("The post could not be found.")
    ).toBeInTheDocument();
  });
});
