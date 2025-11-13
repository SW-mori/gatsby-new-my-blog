import { FC } from "react";
import { PageProps, graphql, Link } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { Layout, SEO, PostCard, PrivateRoute } from "../../components";
import { LANGUAGES, SITE_URL } from "../../constants";
import { AllContentfulPostQuery } from "../../types";
import * as styles from "./TagTemplate.module.scss";

const TagTemplate: FC<PageProps<AllContentfulPostQuery, { tag: string }>> = ({
  data,
  pageContext,
}) => {
  const { t, i18n } = useTranslation("common");
  const posts = data?.allContentfulGatsbyBlog?.nodes ?? [];
  const { tag } = pageContext;

  const alternateLangs = [
    { hreflang: LANGUAGES.JA, href: `${SITE_URL}/tags/${tag}` },
    { hreflang: LANGUAGES.EN, href: `${SITE_URL}/${LANGUAGES.EN}/tags/${tag}` },
  ];

  const shareUrl = `${SITE_URL}/tags/${tag}`;
  const shareText = encodeURIComponent(`${t("tag")}: ${tag}`);

  return (
    <PrivateRoute>
      <Layout pageTitle={`${t("tag")}: ${tag}`}>
        <SEO
          title={`${t("tag")}: ${tag} - ${t("posts")}`}
          description={t("tag_posts_description", { tag })}
          pathname={`/tags/${tag}`}
          lang={i18n.language}
          alternateLangs={alternateLangs}
        />

        <div className={styles.shareButtons}>
          <span>{t("share")}: </span>
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>

        {posts.length === 0 ? (
          <p>{t("no_posts_for_tag", { tag })}</p>
        ) : (
          <div className={styles.grid}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        <Link to="/posts" className={styles.back}>
          ← {t("back_to_posts")}
        </Link>
      </Layout>
    </PrivateRoute>
  );
};

export default TagTemplate;

export const query = graphql`
  query ($tag: String!) {
    allContentfulGatsbyBlog(
      filter: { tags: { eq: $tag } }
      sort: { createdAt: DESC }
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
