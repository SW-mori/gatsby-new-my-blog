import * as React from "react";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { graphql } from "gatsby";
import { Layout, SEO, PrivateRoute } from "../../components";
import { LANGUAGES, SITE_URL } from "../../constants";
import * as styles from "./HomeTemplate.module.scss";

const HomeTemplate: React.FC = () => {
  const { t, i18n } = useTranslation("common");

  const alternateLangs = [
    { hreflang: LANGUAGES.JA, href: `${SITE_URL}/` },
    { hreflang: LANGUAGES.EN, href: `${SITE_URL}/${LANGUAGES.EN}/` },
  ];

  return (
    <PrivateRoute>
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
    </PrivateRoute>
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
