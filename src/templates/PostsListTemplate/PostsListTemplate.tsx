import * as React from "react";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import { PageProps, graphql, Link } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { usePostListTemplate } from "./hooks";
import { Layout, SEO, PostCard, PrivateRoute } from "../../components";
import { LANGUAGES, SITE_URL } from "../../constants";
import { AllContentfulPostQuery, PageContext } from "../../types";
import * as styles from "./PostsListTemplate.module.scss";

const PostsListTemplate: React.FC<
  PageProps<AllContentfulPostQuery, PageContext>
> = ({ data, pageContext }) => {
  const { t, i18n } = useTranslation("common");
  const {
    searchTerm,
    selectedTag,
    relatedArticles,
    handleSearchChange,
    handleTagChange,
    handleTagClick,
    pushEvent,
  } = usePostListTemplate();

  const allPosts = data?.allContentfulGatsbyBlog?.nodes ?? [];
  const { currentPage, numPages } = pageContext;

  const allTags = Array.from(
    new Set(allPosts.flatMap((post) => post.tags ?? []))
  );

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

  const pathname = currentPage === 1 ? `/posts` : `/posts/${currentPage}`;

  const alternateLangs = [
    {
      hreflang: LANGUAGES.JA,
      href:
        currentPage === 1
          ? `${SITE_URL}/posts`
          : `${SITE_URL}/posts/${currentPage}`,
    },
    {
      hreflang: LANGUAGES.EN,
      href:
        currentPage === 1
          ? `${SITE_URL}/${LANGUAGES.EN}/posts`
          : `${SITE_URL}/${LANGUAGES.EN}/posts/${currentPage}`,
    },
  ];

  return (
    <PrivateRoute>
      <Layout pageTitle={`${t("posts")} - ${t("page")} ${currentPage}`}>
        <SEO
          title={`${t("posts")} - ${t("page")} ${currentPage}`}
          description={t("posts_list_description", { page: currentPage })}
          pathname={pathname}
          lang={i18n.language}
          alternateLangs={alternateLangs}
        />

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

        <div className={styles.tagCloud}>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={
                selectedTag === tag ? styles.activeTag : styles.tagButton
              }
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className={styles.posts}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  ...post,
                  tags: post.tags ?? [],
                  excerpt: post.body?.raw
                    ? documentToPlainTextString(
                        JSON.parse(post.body.raw)
                      ).slice(0, 120) + "..."
                    : "",
                }}
              />
            ))
          ) : (
            <p>{t("no_matching_posts")}</p>
          )}
        </div>

        <nav className={styles.pagination}>
          {hasPrev && (
            <Link
              to={prevPage}
              onClick={() => pushEvent("pagination_prev", { page: prevPage })}
            >
              {t("prev")}
            </Link>
          )}

          {hasNext && (
            <Link
              to={nextPage}
              onClick={() => pushEvent("pagination_next", { page: nextPage })}
            >
              {t("next")}
            </Link>
          )}
        </nav>

        {relatedArticles.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>{t("article")}</h2>
            <ul className={styles.relatedList}>
              {relatedArticles.map((a) => (
                <li key={a.id} className={styles.relatedItem}>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.relatedLink}
                  >
                    {a.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Layout>
    </PrivateRoute>
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
