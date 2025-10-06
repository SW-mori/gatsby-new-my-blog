import * as React from "react";
import { PageProps } from "gatsby";
import { NotFound, SEO } from "../components";

const NotFoundPage: React.FC<PageProps> = () => {
  return <NotFound />;
};

export default NotFoundPage;

export const Head = () => (
  <SEO
    title="404 Page"
    description="Gatsby サイトの404ページです"
    image=""
    pathname="/404"
  />
);
