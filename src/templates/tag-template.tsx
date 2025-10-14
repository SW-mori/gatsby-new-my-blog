import * as React from "react";
import { PageProps, graphql, Link } from "gatsby";
import { Layout, SEO } from "../components";
import { QueryData } from "../types";

type TagPageContext = {
  tag: string;
};

const TagTemplate: React.FC<PageProps<QueryData, TagPageContext>> = ({
  data,
  pageContext,
}) => {
  const posts = data?.allContentfulGatsbyBlog?.nodes ?? [];
  const { tag } = pageContext;

  return (
    <Layout pageTitle={`タグ: ${tag}`}>
      <SEO
        title={`タグ: ${tag} の記事一覧`}
        description={`Gatsby + Contentfulで作成したブログでタグ「${tag}」に関連する記事一覧です`}
        pathname={`/tags/${tag}`}
      />

      <div>
        {posts.map((post) => (
          <article key={post.id}>
            <h3>
              <Link to={`/posts/${post.slug}`}>{post.title}</Link>
            </h3>
            <p>{post.date}</p>
          </article>
        ))}
      </div>
    </Layout>
  );
};

export default TagTemplate;

export const query = graphql`
  query ($tag: String!) {
    allContentfulGatsbyBlog(
      filter: { tags: { in: [$tag] } }
      sort: { date: DESC }
    ) {
      nodes {
        id
        title
        slug
        date(formatString: "YYYY/MM/DD")
      }
    }
  }
`;
