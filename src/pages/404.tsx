import * as React from "react";
import { PageProps } from "gatsby";
import { NotFound, SEO } from "../components";
import { useTranslation } from "gatsby-plugin-react-i18next";

const NotFoundPage: React.FC<PageProps> = () => {
  const { t, i18n } = useTranslation("common");
  const siteUrl = "https://my-gatsby-blogs.netlify.app";

  const alternateLangs = [
    { hreflang: "ja", href: `${siteUrl}/404` },
    { hreflang: "en", href: `${siteUrl}/en/404` },
  ];

  return (
    <>
      <SEO
        title={t("404_title") || "404 Page"}
        description={t("404_description") || "Gatsby サイトの404ページです"}
        pathname="/404"
        lang={i18n.language}
        alternateLangs={alternateLangs}
      />
      <NotFound />
    </>
  );
};

export default NotFoundPage;
