import * as React from "react";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { LayoutProps } from "./types";
import { Header } from "../Header";
import * as styles from "./Layout.module.scss";

export const Layout: React.FC<LayoutProps> = ({ pageTitle, children }) => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.container}>
      <Header />
      <main>
        {pageTitle && <h2>{pageTitle}</h2>}
        {children}
      </main>
      <footer className={styles.footer}>
        © {new Date().getFullYear()} {t("site_name")}
      </footer>
    </div>
  );
};
