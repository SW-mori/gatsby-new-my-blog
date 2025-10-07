import { Layout, SEO } from "../components";
import type { PageProps } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import * as React from "react";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout pageTitle="ホーム">
      <p>Gatsbyで画像最適化を試す。</p>
      <StaticImage
        src="../images/sample.png"
        alt="サンプル画像"
        width={400}
        height={300}
        placeholder="blurred"
      />
    </Layout>
  );
};

export default IndexPage;

export const Head = () => (
  <SEO
    title="Home Page"
    description="Gatsby サイトのトップページです"
    image=""
    pathname="/"
  />
);
