import * as React from "react";
import { graphql, PageProps } from "gatsby";
import { Layout, SEO } from "../components";
import { MarkdownData } from "types";

const PostTemplate: React.FC<PageProps<MarkdownData>> = ({ data }) => {
  const post = data.markdownRemark;

  if (!post) return <Layout pageTitle="記事が見つかりません" />;

  return (
    <Layout pageTitle={post.frontmatter.title}>
      <p>{post.frontmatter.date}</p>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </Layout>
  );
};

export default PostTemplate;

export const Head: React.FC<PageProps<MarkdownData>> = ({ data }) => {
  const title =
    data.markdownRemark?.frontmatter.title ?? "記事が見つかりません";
  return <SEO title={title} />;
};

export const query = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        date(formatString: "YYYY/MM/DD")
      }
      html
    }
  }
`;
