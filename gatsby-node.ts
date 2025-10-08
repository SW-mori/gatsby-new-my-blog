// gatsby-node.ts
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

  // Markdown記事をGraphQLで取得
  const result = await graphql<{
    allMarkdownRemark: {
      nodes: {
        id: string;
        frontmatter: { title: string; date: string; tags?: string[] };
        fields?: { slug: string };
      }[];
    };
  }>(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
        nodes {
          id
          frontmatter {
            title
            date
            tags
          }
          fields {
            slug
          }
        }
      }
    }
  `);

  if (result.errors || !result.data) {
    reporter.panic("Error loading Markdown files", result.errors);
    return;
  }

  const posts = result.data.allMarkdownRemark.nodes;

  // ----- 個別記事ページ -----
  posts.forEach((post) => {
    if (!post.fields?.slug) return;
    createPage({
      path: `/posts${post.fields.slug}`,
      component: postTemplate,
      context: {
        id: post.id,
        slug: post.fields.slug,
      },
    });
  });

  // ----- ページネーション -----
  const postsPerPage = 5; // 1ページに表示する記事数
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
  const tags = Array.from(
    new Set(posts.flatMap((post) => post.frontmatter.tags || []))
  );

  tags.forEach((tag) => {
    createPage({
      path: `/tags/${tag}`,
      component: tagTemplate,
      context: { tag },
    });
  });
};

// ----- Markdown ノードに slug を追加 -----
export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  actions,
  getNode,
}) => {
  const { createNodeField } = actions;

  if (node.internal.type === "MarkdownRemark") {
    const parentNode = getNode(node.parent!);

    // fileNode の型を安全にキャスト
    const fileNode = parentNode as { relativePath?: string } | null;

    if (!fileNode?.relativePath) return;

    const slug = `/${fileNode.relativePath.replace(/\.md$/, "")}`;

    createNodeField({
      node,
      name: "slug",
      value: slug,
    });
  }
};
