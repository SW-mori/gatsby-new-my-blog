import { FC } from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";
import { SEOProps } from "./types";

export const SEO: FC<SEOProps> = ({
  title,
  description,
  image,
  pathname,
  articleData,
  lang = "ja",
  alternateLangs,
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

  const {
    title: defaultTitle,
    description: defaultDescription,
    siteUrl,
  } = site.siteMetadata;

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: image ? `${siteUrl}${image}` : `${siteUrl}/images/sample.png`,
    url: `${siteUrl}${pathname || "/"}`,
  };

  const jsonLd = articleData
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: seo.title,
        description: seo.description,
        image: seo.image,
        author: {
          "@type": "Person",
          name: articleData.author || "Unknown Author",
        },
        datePublished: articleData.datePublished,
        publisher: {
          "@type": "Organization",
          name: defaultTitle,
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/images/icon.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": seo.url,
        },
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: seo.url,
        name: seo.title,
        description: seo.description,
        image: seo.image,
      };

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.url} />

      <meta property="og:type" content={articleData ? "article" : "website"} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      {alternateLangs &&
        alternateLangs.map(({ href, hreflang }) => (
          <link
            key={hreflang}
            rel="alternate"
            hrefLang={hreflang}
            href={href}
          />
        ))}
    </Helmet>
  );
};
