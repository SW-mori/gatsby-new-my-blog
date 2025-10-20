import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PageProps } from "gatsby";
import PostsListTemplate from "../PostsListTemplate";
import { AllContentfulPostQuery, PageContext } from "types";

jest.mock("../../../components", () => ({
  __esModule: true,
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SEO: ({ title, description, pathname, alternateLangs }: any) => (
    <div data-testid="seo">
      <span>{title}</span>
      <span>{description}</span>
      <span>{pathname}</span>
      {alternateLangs &&
        alternateLangs.map((alt: any) => (
          <span key={alt.hreflang} data-testid={`alt-${alt.hreflang}`}>
            {alt.href}
          </span>
        ))}
    </div>
  ),
  PostCard: ({ post }: any) => <div data-testid="post">{post.title}</div>,
}));

jest.mock("gatsby-plugin-react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: any) => {
      const translations: Record<string, string> = {
        posts: "Posts",
        page: "Page",
        posts_list_description: `Posts list page ${opts?.page}`,
        search_placeholder: "Search",
        all_tags: "All Tags",
        no_matching_posts: "No matching posts",
        prev: "Prev",
        next: "Next",
      };
      return translations[key] || key;
    },
    i18n: { language: "ja" },
  }),
}));

describe("PostsListTemplate コンポーネント", () => {
  const mockData: AllContentfulPostQuery = {
    allContentfulGatsbyBlog: {
      nodes: [
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
      ],
    },
  };

  const mockPageContext: PageContext = {
    currentPage: 1,
    numPages: 2,
    limit: 10,
    skip: 0,
  };

  const mockLocation: PageProps["location"] = {
    hash: "",
    key: "test",
    pathname: "/posts",
    search: "",
    state: null,
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

  const mockProps: PageProps<AllContentfulPostQuery, PageContext> = {
    data: mockData,
    pageContext: mockPageContext,
    path: "/posts",
    location: mockLocation,
    params: {},
    uri: "/posts",
    children: undefined,
    pageResources: {} as any,
    serverData: {},
  };

  it("SEO コンポーネントが正しく表示される", () => {
    render(<PostsListTemplate {...mockProps} />);
    const seo = screen.getByTestId("seo");
    expect(seo).toHaveTextContent("Posts - Page 1");
    expect(seo).toHaveTextContent("Posts list page 1");
    expect(seo).toHaveTextContent("/posts");

    const altJa = screen.getByTestId("alt-ja");
    const altEn = screen.getByTestId("alt-en");
    expect(altJa).toHaveTextContent("/posts");
    expect(altEn).toHaveTextContent("/en/posts");
  });

  it("全てのポストがレンダリングされる", () => {
    render(<PostsListTemplate {...mockProps} />);
    expect(screen.getByText("React記事")).toBeInTheDocument();
    expect(screen.getByText("Gatsby記事")).toBeInTheDocument();
  });

  it("検索でポストをフィルタできる", () => {
    render(<PostsListTemplate {...mockProps} />);
    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "React" } });
    expect(screen.getByText("React記事")).toBeInTheDocument();
    expect(screen.queryByText("Gatsby記事")).not.toBeInTheDocument();
  });

  it("タグ選択でポストをフィルタできる", () => {
    render(<PostsListTemplate {...mockProps} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Gatsby" } });
    expect(screen.getByText("Gatsby記事")).toBeInTheDocument();
    expect(screen.queryByText("React記事")).not.toBeInTheDocument();
  });

  it("ページネーションリンクが正しく表示される", () => {
    render(<PostsListTemplate {...mockProps} />);
    const nextLink = screen.getByText("Next →");
    expect(nextLink).toHaveAttribute("href", "/posts/2");
    const prevLink = screen.queryByText("← Prev");
    expect(prevLink).not.toBeInTheDocument();
  });

  it("フィルタ結果が0の場合、no matching posts が表示される", () => {
    render(<PostsListTemplate {...mockProps} />);
    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "存在しないタイトル" } });
    expect(screen.getByText("No matching posts")).toBeInTheDocument();
  });
});
