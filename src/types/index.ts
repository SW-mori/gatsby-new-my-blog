export type MarkdownFrontmatter = {
  title: string;
  date: string;
};

export type MarkdownPost = {
  id: string;
  excerpt: string;
  frontmatter: MarkdownFrontmatter;
  fields: {
    slug: string;
  };
};

export type QueryData = {
  allMarkdownRemark: {
    nodes: MarkdownPost[];
  };
};

export type PageContext = {
  limit: number;
  skip: number;
  currentPage: number;
  numPages: number;
};

export type MarkdownData = {
  markdownRemark: {
    frontmatter: MarkdownFrontmatter;
    html: string;
  } | null;
};
