import * as React from "react";
import type { PageProps } from "gatsby";
import { Layout, SEO } from "../components";

const AboutPage: React.FC<PageProps> = () => {
  return (
    <Layout pageTitle="About ページ">
      <p>このサイトは Gatsby の学習用に作成されています。</p>
    </Layout>
  );
};

export default AboutPage;

export const Head = () => (
  <SEO
    title="About Page"
    description="Gatsby サイトのAboutページです"
    image=""
    pathname="/about"
  />
);
