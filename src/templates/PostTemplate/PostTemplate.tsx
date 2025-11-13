import { FC } from "react";
import { graphql, PageProps } from "gatsby";
import { usePostTemplate } from "./hooks";
import { safeParse, safePlainText } from "./utils";
import { Layout, SEO, PostCard, PrivateRoute } from "../../components";
import { LANGUAGES, SITE_URL } from "../../constants";
import { ContentfulPostData } from "../../types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { DiscussionEmbed } from "disqus-react";
import * as styles from "./PostTemplate.module.scss";

const PostTemplate: FC<PageProps<ContentfulPostData>> = ({ data }) => {
  const { t, i18n } = useTranslation("common");
  const { formStatus, handleSubmit, handleTagClick } = usePostTemplate();

  const post = data.contentfulGatsbyBlog;
  const allPosts = data.allContentfulGatsbyBlog?.nodes ?? [];

  if (!post) {
    return (
      <Layout pageTitle={t("post_not_found")}>
        <p>{t("post_not_found_message")}</p>
      </Layout>
    );
  }

  const seoTitle = `${post.title} | ${t("site_name")}`;
  const seoDescription =
    safePlainText(post.body?.raw).slice(0, 120) || post.title;

  const postPath =
    i18n.language === LANGUAGES.EN
      ? `/${LANGUAGES.EN}/posts/${post.slug}`
      : `/posts/${post.slug}`;

  const alternateLangs = [
    { hreflang: LANGUAGES.JA, href: `${SITE_URL}/posts/${post.slug}` },
    {
      hreflang: LANGUAGES.EN,
      href: `${SITE_URL}/${LANGUAGES.EN}/posts/${post.slug}`,
    },
  ];

  const disqusConfig = {
    shortname: "disqus",
    config: {
      identifier: post.slug,
      title: post.title,
      url: `${SITE_URL}${postPath}`,
    },
  };

  const relatedArticles = allPosts
    .filter(
      (p) =>
        p.slug !== post.slug &&
        Array.isArray(p.tags) &&
        Array.isArray(post.tags) &&
        p.tags.some((tag) => post.tags?.includes(tag))
    )
    .slice(0, 3);

  const shareUrl = `${SITE_URL}${postPath}`;
  const shareText = encodeURIComponent(post.title);

  return (
    <PrivateRoute>
      <Layout pageTitle={post.title}>
        <SEO
          title={seoTitle}
          description={seoDescription}
          pathname={postPath}
          image={"/images/sample.png"}
          articleData={{
            author: "test user",
            datePublished: new Date(post.date).toISOString(),
          }}
          lang={i18n.language}
          alternateLangs={alternateLangs}
        />

        <article>
          <p className={styles.date}>{post.date}</p>
          {post.body &&
            safeParse(post.body.raw) &&
            documentToReactComponents(safeParse(post.body.raw)!)}

          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className={styles.tag}
                  onClick={() => handleTagClick(tag)}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

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

        {relatedArticles.length > 0 && (
          <section className={styles.relatedSection}>
            <h2>{t("related_posts")}</h2>
            <div className={styles.relatedPosts}>
              {relatedArticles.map((p) => (
                <PostCard
                  key={p.id}
                  post={{
                    ...p,
                    tags: p.tags ?? [],
                    excerpt: safePlainText(p.body?.raw).slice(0, 120) + "...",
                  }}
                />
              ))}
            </div>
          </section>
        )}

        <section className={styles.comments}>
          <h2>{t("comments")}</h2>
          <DiscussionEmbed {...disqusConfig} />
        </section>

        <section className={styles.form}>
          <h2>{t("contact_author")}</h2>
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="form-name" value="contact" />
            <p hidden>
              <label>
                Don’t fill this out: <input name="bot-field" />
              </label>
            </p>

            <label>
              {t("name")}: <input type="text" name="name" required />
            </label>
            <label>
              {t("email")}: <input type="email" name="email" required />
            </label>
            <label>
              {t("message")}: <textarea name="message" required></textarea>
            </label>

            <button type="submit" disabled={formStatus === "submitting"}>
              {formStatus === "submitting" ? "Sending..." : t("send")}
            </button>
          </form>

          {formStatus === "success" && (
            <p className={styles.formMessageSuccess}>
              {t("form_success_message")}
            </p>
          )}
          {formStatus === "error" && (
            <p className={styles.formMessageError}>{t("form_error_message")}</p>
          )}
        </section>
      </Layout>
    </PrivateRoute>
  );
};

export default PostTemplate;

export const query = graphql`
  query ($slug: String!) {
    contentfulGatsbyBlog(slug: { eq: $slug }) {
      title
      slug
      date(formatString: "YYYY/MM/DD")
      body {
        raw
      }
      tags
    }
    allContentfulGatsbyBlog(sort: { createdAt: DESC }) {
      nodes {
        id
        title
        slug
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
