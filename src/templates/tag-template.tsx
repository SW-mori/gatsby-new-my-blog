import * as React from "react";
import { PageProps, graphql, Link } from "gatsby";
import { Layout, SEO } from "../components";
import { QueryData } from "../types";

const TagTemplate: React.FC<PageProps<QueryData, { tag: string }>> = ({
  data,
  pageContext,
}) => {
  const posts = data.allMarkdownRemark.nodes;
  const { tag } = pageContext;

  return (
    <Layout pageTitle={`タグ: ${tag}`}>
      <SEO
        title={`タグ: ${tag} の記事一覧`}
        description={`Gatsbyで作成したブログでタグ「${tag}」に関連する記事の一覧ページです`}
        pathname={`/tags/${tag}`}
      />

      <div>
        {posts.map((post) => (
          <article key={post.id}>
            <h3>
              <Link to={`/posts${post.fields.slug}`}>
                {post.frontmatter.title}
              </Link>
            </h3>
          </article>
        ))}
      </div>
    </Layout>
  );
};

export default TagTemplate;

export const query = graphql`
  query ($tag: String!) {
    allMarkdownRemark(filter: { frontmatter: { tags: { in: [$tag] } } }) {
      nodes {
        id
        frontmatter {
          title
        }
        fields {
          slug
        }
      }
    }
  }
`;
