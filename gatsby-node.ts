import path from "path";
import type { GatsbyNode } from "gatsby";

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter,
}) => {
  const { createPage } = actions;

  // テンプレートのパス
  const postTemplate = path.resolve("./src/templates/post-template.tsx");
  const postsListTemplate = path.resolve(
    "./src/templates/posts-list-template.tsx"
  );
  const tagTemplate = path.resolve("./src/templates/tag-template.tsx");

  // Contentful から記事を取得
  const result = await graphql<{
    allContentfulGatsbyBlog: {
      nodes: {
        id: string;
        slug: string;
        tags?: string[];
      }[];
    };
  }>(`
    {
      allContentfulGatsbyBlog(sort: { date: DESC }) {
        nodes {
          id
          slug
          tags
        }
      }
    }
  `);

  if (result.errors || !result.data) {
    reporter.panic("Error loading Contentful posts", result.errors);
    return;
  }

  const posts = result.data.allContentfulGatsbyBlog.nodes;

  // ----- 個別記事ページ -----
  posts.forEach((post) => {
    createPage({
      path: `/posts/${post.slug}`,
      component: postTemplate,
      context: {
        slug: post.slug,
      },
    });
  });

  // ----- ページネーション -----
  const postsPerPage = 5;
  const numPages = Math.ceil(posts.length / postsPerPage);

  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/posts` : `/posts/${i + 1}`,
      component: postsListTemplate,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        currentPage: i + 1,
        numPages,
      },
    });
  });

  // ----- タグ別ページ -----
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags || [])));

  tags.forEach((tag) => {
    createPage({
      path: `/tags/${tag}`,
      component: tagTemplate,
      context: { tag },
    });
  });
};
