import * as React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import * as styles from "./Layout.module.scss";
import { LayoutProps } from "./types";

export const Layout: React.FC<LayoutProps> = ({ pageTitle, children }) => {
  // GraphQLでサイトのメタ情報を取得
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `);

  const { title, description } = data.site.siteMetadata;

  return (
    <div className={styles.container}>
      <header>
        <h1>{title}</h1>
        <p>{description}</p>
        <nav className={styles.nav}>
          <Link to="/" className={styles.link}>
            ホームへ
          </Link>
          <Link to="/about" className={styles.link}>
            サンプルページへ
          </Link>
          <Link to="/images" className={styles.link}>
            画像最適化ページへ
          </Link>
          <Link to="/posts" className={styles.link}>
            記事一覧ページへ
          </Link>
        </nav>
      </header>
      <main>
        <h2>{pageTitle}</h2>
        {children}
      </main>
      <footer className={styles.footer}>
        © {new Date().getFullYear()} My Gatsby Site
      </footer>
    </div>
  );
};
