type MarkdownPost = {
  id: string;
  excerpt: string;
  frontmatter: {
    title: string;
    date: string;
  };
  fields: {
    slug: string;
  };
};

export type QueryData = {
  allMarkdownRemark: {
    nodes: MarkdownPost[];
  };
};
