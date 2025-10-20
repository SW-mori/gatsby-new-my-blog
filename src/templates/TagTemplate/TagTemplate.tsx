import * as React from "react";
import { PageProps, graphql, Link } from "gatsby";
import { Layout, SEO, PostCard } from "../../components";
import { AllContentfulPostQuery } from "../../types";
import { useTranslation } from "gatsby-plugin-react-i18next";
import * as styles from "./TagTemplate.module.scss";

const TagTemplate: React.FC<
  PageProps<AllContentfulPostQuery, { tag: string }>
> = ({ data, pageContext }) => {
  const { t, i18n } = useTranslation("common");
  const posts = data?.allContentfulGatsbyBlog?.nodes ?? [];
  const { tag } = pageContext;

  const siteUrl = "https://my-gatsby-blogs.netlify.app";

  const alternateLangs = [
    { hreflang: "ja", href: `${siteUrl}/tags/${tag}` },
    { hreflang: "en", href: `${siteUrl}/en/tags/${tag}` },
  ];

  return (
    <Layout pageTitle={`${t("tag")}: ${tag}`}>
      <SEO
        title={`${t("tag")}: ${tag} - ${t("posts")}`}
        description={t("tag_posts_description", { tag })}
        pathname={`/tags/${tag}`}
        lang={i18n.language}
        alternateLangs={alternateLangs}
      />

      <div>
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
      </div>
    </Layout>
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
