import * as React from "react";
import { Layout, SEO } from "../../components";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { graphql } from "gatsby";
import * as styles from "./HomeTemplate.module.scss";

const HomeTemplate: React.FC = () => {
  const { t, i18n } = useTranslation("common");

  const siteUrl = "https://my-gatsby-blogs.netlify.app";

  const alternateLangs = [
    { hreflang: "ja", href: `${siteUrl}/` },
    { hreflang: "en", href: `${siteUrl}/en/` },
  ];

  return (
    <Layout>
      <SEO
        title={t("seo_home_title")}
        description={t("seo_home_description")}
        pathname="/"
        lang={i18n.language}
        alternateLangs={alternateLangs}
      />
      <div className={styles.container}>
        <h1 className={styles.intro}>{t("home")}</h1>
      </div>
    </Layout>
  );
};

export default HomeTemplate;

export const query = graphql`
  query {
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
