import * as React from "react";
import { graphql, PageProps } from "gatsby";
import { Layout, SEO } from "../components";
import { ContentfulPostData } from "../types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

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
        <p>{post.date}</p>
        {/* リッチテキストをReact要素としてレンダリング */}
        {post.body && documentToReactComponents(JSON.parse(post.body.raw))}
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
    }
  }
`;
