import * as React from "react";
import { graphql, PageProps } from "gatsby";
import { Layout, SEO } from "../../components";
import { ContentfulPostData } from "../../types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import * as styles from "./PostTemplate.module.scss";

const PostTemplate: React.FC<PageProps<ContentfulPostData>> = ({ data }) => {
  const post = data.contentfulGatsbyBlog;

  if (!post) {
    return (
      <Layout pageTitle="記事が見つかりません">
        <p>指定された記事は存在しません。</p>
      </Layout>
    );
  }

  return (
    <Layout pageTitle={post.title}>
      <SEO
        title={post.title}
        description={post.title}
        pathname={`/posts/${post.slug}`}
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
      date(formatString: "YYYY/MM/DD")
      body {
        raw
      }
      tags
    }
  }
`;
