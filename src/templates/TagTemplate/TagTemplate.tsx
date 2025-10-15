import * as React from "react";
import { PageProps, graphql, Link } from "gatsby";
import { Layout, SEO, PostCard } from "../../components";
import { AllContentfulPostQuery } from "types";
import * as styles from "./TagTemplate.module.scss";

const TagTemplate: React.FC<
  PageProps<AllContentfulPostQuery, { tag: string }>
> = ({ data, pageContext }) => {
  const posts = data?.allContentfulGatsbyBlog?.nodes ?? [];
  const { tag } = pageContext;

  return (
    <Layout pageTitle={`タグ: ${tag}`}>
      <SEO
        title={`タグ: ${tag} の記事一覧`}
        description={`Gatsby + Contentful でタグ「${tag}」に関連する記事の一覧ページです`}
        pathname={`/tags/${tag}`}
      />

      <div>
        {posts.length === 0 ? (
          <p>タグ「{tag}」に関連する記事はありません。</p>
        ) : (
          <div className={styles.grid}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        <Link to="/posts" className={styles.back}>
          ← 記事一覧に戻る
        </Link>
      </div>
    </Layout>
  );
};

export default TagTemplate;

export const query = graphql`
  query ($tag: String!) {
    allContentfulGatsbyBlog(
      filter: { tags: { eq: $tag } }
      sort: { createdAt: DESC }
    ) {
      nodes {
        id
        title
        slug
        date(formatString: "YYYY/MM/DD")
        tags
      }
    }
  }
`;
