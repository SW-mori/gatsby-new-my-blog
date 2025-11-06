import { PROFILE_STATUS } from "../constants";

export type ContentfulPost = {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags?: string[];
  body?: {
    raw: string;
  };
  excerpt?: string;
  featuredImage?: any;
};

export type AllContentfulPostQuery = {
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

export type ContentfulRichText = {
  raw: string;
};

export type ContentfulPostNode = {
  title: string;
  slug: string;
  date: string;
  body?: ContentfulRichText;
  tags?: string[];
};

export type ContentfulPostData = {
  contentfulGatsbyBlog: ContentfulPostNode | null;
  allContentfulGatsbyBlog: {
    nodes: ContentfulPost[];
  };
};

export type ProfileStatus =
  (typeof PROFILE_STATUS)[keyof typeof PROFILE_STATUS];
