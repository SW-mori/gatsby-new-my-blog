import * as React from "react";
import { Link } from "gatsby";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import * as styles from "./Layout.module.scss";
import { LayoutProps } from "./types";

export const Layout: React.FC<LayoutProps> = ({ pageTitle, children }) => {
  const { t } = useTranslation("common");
  const { language, originalPath } = useI18next();

  const languages = ["ja", "en"];

  const getPathForLanguage = (lng: string) => {
    if (lng === "ja") {
      // デフォルト言語は / に置換
      const path = originalPath.replace(/^\/en/, "");
      return path === "/en/" ? "/" : path;
    } else {
      // 英語は /en/... の形式
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
          <Link to="/images" className={styles.link}>
            {t("images_page") || "画像最適化ページ"}
          </Link>
          <Link to="/posts" className={styles.link}>
            {t("posts")}
          </Link>
        </nav>

        {/* 言語切替ボタン */}
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
