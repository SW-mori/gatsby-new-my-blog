export type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
  pathname?: string;
  articleData?: {
    author?: string;
    datePublished?: string;
  };
  lang?: string;
  alternateLangs?: { href: string; hreflang: string }[];
};
