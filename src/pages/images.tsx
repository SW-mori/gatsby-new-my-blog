import * as React from "react";
import { Layout, SEO } from "../components";
import { StaticImage } from "gatsby-plugin-image";
import * as styles from "@styles/images.module.scss";

const ImagesPage = () => (
  <Layout pageTitle="画像最適化">
    <div className={styles.container}>
      <h1>画像最適化のサンプル</h1>
      <StaticImage
        src="../images/sample.png"
        alt="サンプル画像"
        width={600}
        height={400}
        placeholder="blurred"
        className={styles.image}
      />
    </div>
  </Layout>
);

export default ImagesPage;

export const Head = () => (
  <SEO
    title="Images Page"
    description="Gatsby 画像最適化ページです"
    pathname="/images"
  />
);
