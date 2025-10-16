import path from "path";
import type { GatsbyNode } from "gatsby";

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter,
}) => {
  const { createPage } = actions;

  const homeTemplate = path.resolve(
    "./src/templates/HomeTemplate/HomeTemplate.tsx"
  );
  const postTemplate = path.resolve(
    "./src/templates/PostTemplate/PostTemplate.tsx"
  );
  const postsListTemplate = path.resolve(
    "./src/templates/PostsListTemplate/PostsListTemplate.tsx"
  );
  const tagTemplate = path.resolve(
    "./src/templates/TagTemplate/TagTemplate.tsx"
  );

  // --- Contentful から記事取得 ---
  const result = await graphql<{
    allContentfulGatsbyBlog: {
      nodes: {
        id: string;
        slug: string;
        title: string;
        date: string;
        tags?: string[];
      }[];
    };
  }>(`
    query AllContentfulPostsForGatsbyNode {
      allContentfulGatsbyBlog(sort: { createdAt: DESC }) {
        nodes {
          id
          slug
          title
          date
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

  // --- ホームページ ---
  createPage({
    path: `/`,
    component: homeTemplate,
    context: {},
  });

  // --- 個別記事ページ ---
  posts.forEach((post) => {
    createPage({
      path: `/posts/${post.slug}`,
      component: postTemplate,
      context: { slug: post.slug },
    });
  });

  const postsPerPage = 5;
  const numPages = Math.ceil(posts.length / postsPerPage);

  // --- ページネーション ---
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

  // --- タグ別ページ ---
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));
  tags.forEach((tag) => {
    createPage({
      path: `/tags/${tag}`,
      component: tagTemplate,
      context: { tag },
    });
  });
};
