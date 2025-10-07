import * as React from "react";
import { Layout, SEO } from "../components";
import * as styles from "@styles/index.module.scss";

const IndexPage = () => (
  <Layout>
    <div className={styles.container}>
      <h1 className={styles.intro}>ホーム画面へようこそ</h1>
    </div>
  </Layout>
);

export default IndexPage;

export const Head = () => (
  <SEO
    title="Home Page"
    description="Gatsby サイトのトップページです"
    pathname="/"
  />
);
