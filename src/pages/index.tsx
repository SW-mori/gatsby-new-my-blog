import * as React from "react";
import { Link } from "gatsby";

const IndexPage: React.FC = () => {
  return (
    <main>
      <h1>Hello Gatsby!</h1>
      <p>Gatsbyで作ったトップページです。</p>
      <Link to="/about">About ページへ移動</Link>
    </main>
  );
};

export default IndexPage;
