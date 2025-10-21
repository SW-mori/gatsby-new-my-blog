import * as React from "react";
import { graphql, PageProps } from "gatsby";
import { Layout, SEO } from "../../components";
import { ContentfulPostData } from "../../types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { DiscussionEmbed } from "disqus-react";
import * as styles from "./PostTemplate.module.scss";

const PostTemplate: React.FC<PageProps<ContentfulPostData>> = ({ data }) => {
  const { t, i18n } = useTranslation("common");
  const post = data.contentfulGatsbyBlog;

  const [formStatus, setFormStatus] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  if (!post) {
    return (
      <Layout pageTitle={t("post_not_found")}>
        <p>{t("post_not_found_message")}</p>
      </Layout>
    );
  }

  const siteUrl = "https://my-gatsby-blogs.netlify.app";

  const seoTitle = `${post.title} | ${t("site_name")}`;
  const seoDescription = post.body ? post.body.raw.slice(0, 120) : post.title;

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

  const disqusConfig = {
    shortname: "disqus",
    config: {
      identifier: post.slug,
      title: post.title,
      url: `${siteUrl}/posts/${post.slug}`,
    },
  };

  // Netlifyフォーム送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (response.ok) {
        setFormStatus("success");
        form.reset();
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

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

      {/* コメントセクション */}
      <section className={styles.comments}>
        <h2>{t("comments")}</h2>
        <DiscussionEmbed {...disqusConfig} />
      </section>

      {/* お問い合わせフォーム */}
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

        {/* 送信ステータスメッセージ */}
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
