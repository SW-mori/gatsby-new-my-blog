import * as React from "react";
import type { PageProps } from "gatsby";
import { Layout, SEO } from "../components";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout pageTitle="ホーム">
      <p>Gatsby + TypeScript で作ったトップページです。</p>
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
