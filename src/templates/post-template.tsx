import * as React from "react";
import { graphql } from "gatsby";
import { Layout, SEO } from "../components";

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

const PostTemplate = ({ data }: any) => {
  const post = data.markdownRemark;

  return (
    <Layout pageTitle={post.frontmatter.title}>
      <p>{post.frontmatter.date}</p>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </Layout>
  );
};

export default PostTemplate;

export const Head = ({ data }: any) => (
  <SEO title={data.markdownRemark.frontmatter.title} />
);
