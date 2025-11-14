import path from "path";
import type { GatsbyNode } from "gatsby";

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter,
}) => {
  const { createPage } = actions;

  const postTemplate = path.resolve(
    "./src/templates/PostTemplate/PostTemplate.tsx"
  );
  const postsListTemplate = path.resolve(
    "./src/templates/PostsListTemplate/PostsListTemplate.tsx"
  );
  const tagTemplate = path.resolve(
    "./src/templates/TagTemplate/TagTemplate.tsx"
  );

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

  posts.forEach((post) => {
    createPage({
      path: `/posts/${post.slug}`,
      component: postTemplate,
      context: { slug: post.slug },
    });
  });

  const postsPerPage = 5;
  const numPages = Math.ceil(posts.length / postsPerPage);

  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/` : `/${i + 1}`,
      component: postsListTemplate,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        currentPage: i + 1,
        numPages,
      },
    });
  });

  const tags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));
  tags.forEach((tag) => {
    createPage({
      path: `/tags/${tag}`,
      component: tagTemplate,
      context: { tag },
    });
  });
};
