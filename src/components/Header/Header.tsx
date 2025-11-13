import { FC, useState } from "react";
import { Link } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { LANGUAGES } from "../../constants";
import * as styles from "./Header.module.scss";
import { useHeader } from "./hooks";

const languages = [LANGUAGES.JA, LANGUAGES.EN];

export const Header: FC = () => {
  const { t } = useTranslation("common");
  const {
    getPathForLanguage,
    handleLogout,
    isAuthenticated,
    language,
    loading,
  } = useHeader();

  const [menuOpen, setMenuOpen] = useState(false);

  const NavLinks = () => (
    <>
      {loading ? (
        <span className={styles.loading}>{t("loading")}</span>
      ) : isAuthenticated ? (
        <>
          <Link to="/dashboard" className={styles.link}>
            {t("dashboard")}
          </Link>
          <Link to="/posts" className={styles.link}>
            {t("posts")}
          </Link>
          <Link to="/error-logs" className={styles.link}>
            {t("errorLogs")}
          </Link>
          <Link to="/settings" className={styles.link}>
            {t("settings")}
          </Link>
          <button onClick={handleLogout} className={styles.logoutButton}>
            {t("logout")}
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className={styles.link}>
            {t("login")}
          </Link>
          <Link to="/signup" className={styles.button}>
            {t("resister")}
          </Link>
        </>
      )}
    </>
  );

  const LanguageSwitcher = () => (
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
  );

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          {t("home")}
        </Link>

        {/* 通常ナビ */}
        <nav className={styles.nav}>
          <NavLinks />
          <LanguageSwitcher />
        </nav>

        {/* ハンバーガーメニュー */}
        <div
          className={`${styles.menuButton} ${menuOpen ? styles.active : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* オーバーレイ */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.open : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* モバイルメニュー */}
      <div className={`${styles.mobileNav} ${menuOpen ? styles.open : ""}`}>
        <div className={styles.mobileNavInner}>
          <NavLinks />
          <div className={styles.mobileLanguage}>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};
