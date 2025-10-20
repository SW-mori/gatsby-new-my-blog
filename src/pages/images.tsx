import * as React from "react";
import { Layout, SEO } from "../components";
import { StaticImage } from "gatsby-plugin-image";
import { useTranslation } from "gatsby-plugin-react-i18next";
import * as styles from "@styles/images.module.scss";
import { graphql } from "gatsby";

const ImagesPage: React.FC = () => {
  const { t, i18n } = useTranslation("common");

  const siteUrl = "https://my-gatsby-blogs.netlify.app";

  const alternateLangs = [
    { hreflang: "ja", href: `${siteUrl}/images` },
    { hreflang: "en", href: `${siteUrl}/en/images` },
  ];

  return (
    <Layout pageTitle={t("images_page")}>
      <SEO
        title={t("images_page")}
        description={
          t("images_page_description") || "Gatsby 画像最適化ページです"
        }
        pathname="/images"
        lang={i18n.language}
        alternateLangs={alternateLangs}
      />

      <div className={styles.container}>
        <h1>{t("images_page")}</h1>
        <StaticImage
          src="../images/sample.png"
          alt={t("images_page")}
          width={600}
          height={400}
          placeholder="blurred"
          className={styles.image}
        />
      </div>
    </Layout>
  );
};

export default ImagesPage;

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
