import * as React from "react";
import { PageProps, graphql, Link } from "gatsby";
import { Layout, SEO } from "../components";
import { AllContentfulPostQuery, PageContext } from "../types";
import { PostCard } from "../components/PostCard";

const PostsListTemplate: React.FC<
  PageProps<AllContentfulPostQuery, PageContext>
> = ({ data, pageContext }) => {
  const posts = data?.allContentfulGatsbyBlog?.nodes ?? [];
  const { currentPage, numPages } = pageContext;

  const prevPage = currentPage === 2 ? `/posts` : `/posts/${currentPage - 1}`;
  const nextPage = `/posts/${currentPage + 1}`;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < numPages;

  return (
    <Layout pageTitle={`記事一覧 - ページ ${currentPage}`}>
      <SEO
        title={`記事一覧 - ページ ${currentPage}`}
        description={`Gatsby + Contentful の記事一覧ページ ${currentPage}`}
        pathname={currentPage === 1 ? `/posts` : `/posts/${currentPage}`}
      />

      <div>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

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
    allContentfulGatsbyBlog(
      sort: { createdAt: DESC }
      skip: $skip
      limit: $limit
    ) {
      nodes {
        id
        slug
        title
        date(formatString: "YYYY/MM/DD")
        tags
      }
    }
  }
`;
