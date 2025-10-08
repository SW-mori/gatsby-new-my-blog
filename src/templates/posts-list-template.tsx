import * as React from "react";
import { PageProps, graphql, Link } from "gatsby";
import { Layout, SEO } from "../components";
import { PageContext, QueryData } from "../types";

const PostsListTemplate: React.FC<PageProps<QueryData, PageContext>> = ({
  data,
  pageContext,
}) => {
  const posts = data.allMarkdownRemark.nodes;
  const { currentPage, numPages } = pageContext;

  return (
    <Layout pageTitle={`記事一覧 - ページ ${currentPage}`}>
      <SEO
        title={`記事一覧 - ページ ${currentPage}`}
        description={`Gatsbyで作ったブログのページ ${currentPage} です`}
        pathname={`/posts/${currentPage === 1 ? "" : currentPage}`}
      />

      <div>
        {posts.map((post) => (
          <article key={post.id}>
            <h3>
              <Link to={`/posts${post.fields.slug}`}>
                {post.frontmatter.title}
              </Link>
            </h3>
            <p>{post.frontmatter.date}</p>
            <p>{post.excerpt}</p>
          </article>
        ))}

        {/* ページネーションリンク */}
        <div>
          {currentPage > 1 && (
            <Link
              to={currentPage === 2 ? `/posts` : `/posts/${currentPage - 1}`}
            >
              前へ
            </Link>
          )}
          {currentPage < numPages && (
            <Link to={`/posts/${currentPage + 1}`}>次へ</Link>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PostsListTemplate;

export const query = graphql`
  query ($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      skip: $skip
      limit: $limit
    ) {
      nodes {
        id
        frontmatter {
          title
          date(formatString: "YYYY/MM/DD")
        }
        fields {
          slug
        }
      }
    }
  }
`;
