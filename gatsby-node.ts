import path from "path";
import { createFilePath } from "gatsby-source-filesystem";
import type { GatsbyNode } from "gatsby";

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  actions,
  getNode,
}) => {
  const { createNodeField } = actions;

  if (node.internal.type === "MarkdownRemark") {
    const slug = createFilePath({ node, getNode, basePath: "content" });
    createNodeField({
      node,
      name: "slug",
      value: slug,
    });
  }
};

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter,
}) => {
  const { createPage } = actions;

  const result = await graphql<{
    allMarkdownRemark: {
      nodes: {
        id: string;
        fields: { slug: string };
      }[];
    };
  }>(`
    query {
      allMarkdownRemark {
        nodes {
          id
          fields {
            slug
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(
      "❌ Markdown データの取得に失敗しました",
      result.errors
    );
    return;
  }

  const posts = result.data?.allMarkdownRemark.nodes ?? [];

  const template = path.resolve("./src/templates/post-template.tsx");

  posts.forEach((post) => {
    createPage({
      path: `/posts${post.fields.slug}`,
      component: template,
      context: {
        id: post.id,
      },
    });
  });

  reporter.info(`✅ ${posts.length} ページを生成しました！`);
};
