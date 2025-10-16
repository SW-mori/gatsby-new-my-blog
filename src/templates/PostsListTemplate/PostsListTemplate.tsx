import * as React from "react";
import { PageProps, graphql, Link } from "gatsby";
import { Layout, SEO, PostCard } from "../../components";
import { AllContentfulPostQuery, PageContext } from "../../types";
import { useTranslation } from "gatsby-plugin-react-i18next";
import * as styles from "./PostsListTemplate.module.scss";

const PostsListTemplate: React.FC<
  PageProps<AllContentfulPostQuery, PageContext>
> = ({ data, pageContext }) => {
  const { t } = useTranslation("common");

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
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag
      ? (post.tags ?? []).includes(selectedTag)
      : true;
    return matchesSearch && matchesTag;
  });

  const prevPage = currentPage === 2 ? `/posts` : `/posts/${currentPage - 1}`;
  const nextPage = `/posts/${currentPage + 1}`;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < numPages;

  return (
    <Layout pageTitle={`${t("posts")} - ${t("page")} ${currentPage}`}>
      <SEO
        title={`${t("posts")} - ${t("page")} ${currentPage}`}
        description={t("posts_list_description", { page: currentPage })}
        pathname={currentPage === 1 ? `/posts` : `/posts/${currentPage}`}
      />

      <div>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder={t("search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
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
          {hasPrev ? <Link to={prevPage}>← {t("prev")}</Link> : <span />}
          {hasNext ? <Link to={nextPage}>{t("next")} →</Link> : <span />}
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
