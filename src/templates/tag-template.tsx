import * as React from "react";
import { PageProps, graphql, Link } from "gatsby";
import { Layout, SEO } from "../components";
import { AllContentfulPostQuery } from "../types";
import { PostCard } from "../components/PostCard";

const TagTemplate: React.FC<
  PageProps<AllContentfulPostQuery, { tag: string }>
> = ({ data, pageContext }) => {
  const posts = data?.allContentfulGatsbyBlog?.nodes ?? [];
  const { tag } = pageContext;

  return (
    <Layout pageTitle={`タグ: ${tag}`}>
      <SEO
        title={`タグ: ${tag} の記事一覧`}
        description={`タグ「${tag}」に関連する記事の一覧`}
        pathname={`/tags/${tag}`}
      />

      <div>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        <Link to="/posts">記事一覧に戻る</Link>
      </div>
    </Layout>
  );
};

export default TagTemplate;

export const query = graphql`
  query ($tag: String!) {
    allContentfulGatsbyBlog(filter: { tags: { in: [$tag] } }) {
      nodes {
        id
        slug
        title
        date(formatString: "YYYY/MM/DD")
        tags
      }
    }
  }
`;
