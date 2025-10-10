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

  // ページネーション用パス
  const prevPage = currentPage === 2 ? `/posts` : `/posts/${currentPage - 1}`;
  const nextPage = `/posts/${currentPage + 1}`;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < numPages;

  return (
    <Layout pageTitle={`記事一覧 - ページ ${currentPage}`}>
      <SEO
        title={`記事一覧 - ページ ${currentPage}`}
        description={`Gatsbyで作ったブログのページ ${currentPage} です`}
        pathname={currentPage === 1 ? `/posts` : `/posts/${currentPage}`}
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

        {/* ページネーション */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "2rem",
          }}
        >
          {hasPrev ? <Link to={prevPage}>← 前へ</Link> : <span />}
          {hasNext ? <Link to={nextPage}>次へ →</Link> : <span />}
        </nav>
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
        excerpt(pruneLength: 100)
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
