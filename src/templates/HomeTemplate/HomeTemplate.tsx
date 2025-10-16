import * as React from "react";
import { Layout, SEO } from "../../components";
import { useTranslation } from "gatsby-plugin-react-i18next";
import * as styles from "./HomeTemplate.module.scss";

const HomeTemplate: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <Layout>
      <SEO
        title={t("seo.home.title")}
        description={t("seo.home.description")}
        pathname={`/`}
      />
      <div className={styles.container}>
        <h1 className={styles.intro}>{t("home")}</h1>
      </div>
    </Layout>
  );
};

export default HomeTemplate;
