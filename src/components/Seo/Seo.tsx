import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { SEOProps } from "./types";

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  pathname,
}) => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          siteUrl
        }
      }
    }
  `);

  const metaTitle = title || site.siteMetadata.title;
  const metaDescription = description || site.siteMetadata.description;
  const metaImage = image
    ? `${site.siteMetadata.siteUrl}${image}`
    : `${site.siteMetadata.siteUrl}/default-og.jpg`;
  const url = `${site.siteMetadata.siteUrl}${pathname || ""}`;

  return (
    <>
      <title>
        {metaTitle} | {site.siteMetadata.title}
      </title>
      <meta name="description" content={metaDescription} />

      {/* OGP */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={metaImage} />

      {/* Twitterカード */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </>
  );
};
