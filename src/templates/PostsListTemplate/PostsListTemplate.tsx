import * as React from "react";
import { PageProps, graphql, Link } from "gatsby";
import { Layout, SEO, PostCard } from "../../components";
import { AllContentfulPostQuery, PageContext } from "../../types";
import { useTranslation } from "gatsby-plugin-react-i18next";
import * as styles from "./PostsListTemplate.module.scss";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";

const PostsListTemplate: React.FC<
  PageProps<AllContentfulPostQuery, PageContext>
> = ({ data, pageContext }) => {
  const { t, i18n } = useTranslation("common");

  const allPosts = data?.allContentfulGatsbyBlog?.nodes ?? [];
  const { currentPage, numPages } = pageContext;

  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [selectedTag, setSelectedTag] = React.useState<string>("");

  // タグ一覧を取得
  const allTags = Array.from(
    new Set(allPosts.flatMap((post) => post.tags ?? []))
  );

  // 検索とタグフィルタ適用
  const filteredPosts = allPosts.filter((post) => {
    const titleMatch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const bodyText = post.body?.raw
      ? documentToPlainTextString(JSON.parse(post.body.raw))
      : "";
    const bodyMatch = bodyText.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag
      ? (post.tags ?? []).includes(selectedTag)
      : true;

    return (titleMatch || bodyMatch) && matchesTag;
  });

  const prevPage = currentPage === 2 ? `/posts` : `/posts/${currentPage - 1}`;
  const nextPage = `/posts/${currentPage + 1}`;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < numPages;

  const siteUrl = "https://my-gatsby-blogs.netlify.app";
  const pathname = currentPage === 1 ? `/posts` : `/posts/${currentPage}`;

  const alternateLangs = [
    {
      hreflang: "ja",
      href:
        currentPage === 1
          ? `${siteUrl}/posts`
          : `${siteUrl}/posts/${currentPage}`,
    },
    {
      hreflang: "en",
      href:
        currentPage === 1
          ? `${siteUrl}/en/posts`
          : `${siteUrl}/en/posts/${currentPage}`,
    },
  ];

  const pushEvent = (event: string, data: Record<string, any> = {}) => {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event, ...data });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    pushEvent("search_input", {
      search_term: value,
      page_path: window.location.pathname,
    });
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tag = e.target.value;
    setSelectedTag(tag);
    pushEvent("tag_filter", {
      tag_name: tag || "all",
      page_path: window.location.pathname,
    });
  };

  return (
    <Layout pageTitle={`${t("posts")} - ${t("page")} ${currentPage}`}>
      <SEO
        title={`${t("posts")} - ${t("page")} ${currentPage}`}
        description={t("posts_list_description", { page: currentPage })}
        pathname={pathname}
        lang={i18n.language}
        alternateLangs={alternateLangs}
      />

      <div>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder={t("search_placeholder")}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <select value={selectedTag} onChange={handleTagChange}>
            <option value="">{t("all_tags")}</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.posts}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={{ ...post, tags: post.tags ?? [] }}
              />
            ))
          ) : (
            <p>{t("no_matching_posts")}</p>
          )}
        </div>

        <nav className={styles.pagination}>
          {hasPrev ? (
            <Link
              to={prevPage}
              onClick={() => pushEvent("pagination_prev", { page: prevPage })}
            >
              ← {t("prev")}
            </Link>
          ) : (
            <span />
          )}
          {hasNext ? (
            <Link
              to={nextPage}
              onClick={() => pushEvent("pagination_next", { page: nextPage })}
            >
              {t("next")} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </Layout>
  );
};

export default PostsListTemplate;

export const query = graphql`
  query ($skip: Int!, $limit: Int!) {
    allContentfulGatsbyBlog(
      sort: { createdAt: DESC }
      skip: $skip
      limit: $limit
    ) {
      nodes {
        id
        title
        slug
        date(formatString: "YYYY/MM/DD")
        tags
        body {
          raw
        }
      }
    }
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
