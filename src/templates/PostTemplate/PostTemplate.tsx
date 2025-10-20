import * as React from "react";
import { graphql, PageProps } from "gatsby";
import { Layout, SEO } from "../../components";
import { ContentfulPostData } from "../../types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { useTranslation } from "gatsby-plugin-react-i18next";
import * as styles from "./PostTemplate.module.scss";

const PostTemplate: React.FC<PageProps<ContentfulPostData>> = ({ data }) => {
  const { t, i18n } = useTranslation("common");
  const post = data.contentfulGatsbyBlog;

  if (!post) {
    return (
      <Layout pageTitle={t("post_not_found")}>
        <p>{t("post_not_found_message")}</p>
      </Layout>
    );
  }

  const seoTitle = `${post.title} | ${t("site_name")}`;
  const seoDescription = post.body ? post.body.raw.slice(0, 120) : post.title;

  const siteUrl = "https://my-gatsby-blogs.netlify.app";
  const alternateLangs = [
    {
      hreflang: "ja",
      href: `${siteUrl}/posts/${post.slug}`,
    },
    {
      hreflang: "en",
      href: `${siteUrl}/en/posts/${post.slug}`,
    },
  ];

  return (
    <Layout pageTitle={post.title}>
      <SEO
        title={seoTitle}
        description={seoDescription}
        pathname={`/posts/${post.slug}`}
        image={"/images/sample.png"}
        articleData={{
          author: "tatsu mori",
          datePublished: new Date(post.date).toISOString(),
        }}
        lang={i18n.language}
        alternateLangs={alternateLangs}
      />

      <article>
        <p className={styles.date}>{post.date}</p>
        {post.body && documentToReactComponents(JSON.parse(post.body.raw))}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Layout>
  );
};

export default PostTemplate;

export const query = graphql`
  query ($slug: String!) {
    contentfulGatsbyBlog(slug: { eq: $slug }) {
      title
      slug
      date(formatString: "YYYY-MM-DDTHH:mm:ssZ")
      body {
        raw
      }
      tags
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
