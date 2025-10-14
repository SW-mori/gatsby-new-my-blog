export type ContentfulPost = {
  id: string;
  title: string;
  slug: string;
  date: string;
  body?: {
    raw: string;
  };
  tags?: string[];
};

export type QueryData = {
  allContentfulGatsbyBlog: {
    nodes: ContentfulPost[];
  };
};

export type PageContext = {
  limit: number;
  skip: number;
  currentPage: number;
  numPages: number;
};

export type ContentfulPostData = {
  contentfulGatsbyBlog: {
    title: string;
    slug: string;
    date: string;
    body?: {
      raw: string;
    };
  } | null;
};
