import * as React from "react";
import { Link } from "gatsby";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import * as styles from "./Layout.module.scss";
import { LayoutProps } from "./types";

export const Layout: React.FC<LayoutProps> = ({ pageTitle, children }) => {
  const { t } = useTranslation("common");
  const { language, originalPath, languages } = useI18next();

  // 現在の言語以外のリンク
  const otherLanguages = languages.filter((lng) => lng !== language);

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

        {/* 言語切替リンク */}
        <div className={styles.languageSwitcher}>
          {otherLanguages.map((lng) => {
            let newPath: string;

            if (lng === "ja") {
              // デフォルト言語は / に置換
              newPath = originalPath.replace(/^\/en/, "");
              if (originalPath === "/en/") newPath = "/";
            } else {
              // デフォルト以外の言語は /en/... の形式
              if (originalPath === "/") {
                newPath = `/${lng}/`;
              } else {
                newPath = `/${lng}${originalPath}`;
              }
            }

            return (
              <Link key={lng} to={newPath}>
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
