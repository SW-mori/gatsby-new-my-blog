import * as React from "react";
import { Link } from "gatsby";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import { LoginButton } from "../Login";
import { LayoutProps } from "./types";
import { LANGUAGES } from "../../constants";
import * as styles from "./Layout.module.scss";

const languages = [LANGUAGES.JA, LANGUAGES.EN];

export const Layout: React.FC<LayoutProps> = ({ pageTitle, children }) => {
  const { t } = useTranslation("common");
  const { language, originalPath } = useI18next();

  const getPathForLanguage = (lng: string) => {
    if (lng === LANGUAGES.JA) {
      const path = originalPath.replace(/^\/en/, "");
      return path === `/${LANGUAGES.EN}/` ? "/" : path;
    } else {
      return originalPath === "/" ? `/${lng}/` : `/${lng}${originalPath}`;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{t("site_name")}</h1>

        <nav className={styles.nav}>
          <Link to="/" className={styles.link}>
            {t("home")}
          </Link>
          <Link to="/posts" className={styles.link}>
            {t("posts")}
          </Link>
        </nav>
        <div className={styles.right}>
          <LoginButton />
        </div>
        <div className={styles.languageSwitcher}>
          {languages.map((lng) => {
            const path = getPathForLanguage(lng);
            const isActive = lng === language;

            return isActive ? (
              <span key={lng} className={styles.activeLanguage}>
                {lng.toUpperCase()}
              </span>
            ) : (
              <Link key={lng} to={path} className={styles.languageLink}>
                {lng.toUpperCase()}
              </Link>
            );
          })}
        </div>
      </header>

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
