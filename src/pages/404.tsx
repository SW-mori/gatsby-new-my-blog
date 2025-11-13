import { FC } from "react";
import { PageProps } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { NotFound, SEO } from "../components";
import { LANGUAGES, SITE_URL } from "../constants";

const NotFoundPage: FC<PageProps> = () => {
  const { t, i18n } = useTranslation("common");

  const alternateLangs = [
    { hreflang: LANGUAGES.JA, href: `${SITE_URL}/404` },
    { hreflang: LANGUAGES.EN, href: `${SITE_URL}/${LANGUAGES.EN}/404` },
  ];

  return (
    <>
      <SEO
        title={t("404_title") || "404 Page"}
        description={t("404_description")}
        pathname="/404"
        lang={i18n.language}
        alternateLangs={alternateLangs}
      />
      <NotFound />
    </>
  );
};

export default NotFoundPage;
