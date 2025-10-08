import * as React from "react";
import { QueryData } from "../types";
import { Layout, SEO } from "../components";
import { graphql, type PageProps, Link } from "gatsby";
import * as styles from "@styles/posts.module.scss";

const PostsPage: React.FC<PageProps<QueryData>> = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout pageTitle="記事一覧">
      <div className={styles.postList}>
        {posts.map((post) => (
          <article key={post.id} className={styles.post}>
            <h3 className={styles.postTitle}>
              <Link to={`/posts${post.fields.slug}`}>
                {post.frontmatter.title}
              </Link>
            </h3>
            <p className={styles.postDate}>{post.frontmatter.date}</p>
            <p className={styles.postExcerpt}>{post.excerpt}</p>
          </article>
        ))}
      </div>
    </Layout>
  );
};

export default PostsPage;

export const query = graphql`
  query {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        id
        excerpt
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

export const Head = () => (
  <SEO
    title="Posts Page"
    description="Markdown 記事一覧ページです"
    pathname="/posts"
  />
);
