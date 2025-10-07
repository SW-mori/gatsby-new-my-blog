import { Layout, SEO } from "../components";
import { QueryData } from "./types";
import { graphql, type PageProps } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import * as React from "react";
import * as styles from "./index.module.scss";

const IndexPage: React.FC<PageProps<QueryData>> = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes;
  return (
    <Layout pageTitle="ホーム">
      <div className={styles.container}>
        <h1>画像最適化</h1>
        <p className={styles.intro}>
          Gatsbyで画像最適化と記事一覧を試してみましょう。
        </p>
        <StaticImage
          src="../images/sample.png"
          alt="サンプル画像"
          width={600}
          height={400}
          placeholder="blurred"
          className={styles.image}
        />

        <h1>ブログ一覧</h1>
        <div className={styles.postList}>
          {posts.map((post) => (
            <article key={post.id} className={styles.post}>
              <h3 className={styles.postTitle}>{post.frontmatter.title}</h3>
              <p className={styles.postDate}>{post.frontmatter.date}</p>
              <p className={styles.postExcerpt}>{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;

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
      }
    }
  }
`;

export const Head = () => (
  <SEO
    title="Home Page"
    description="Gatsby サイトのトップページです"
    image=""
    pathname="/"
  />
);
