import { Link } from "gatsby";
import { LayoutProps } from "./types";
import * as styles from "./Layout.module.scss";
import * as React from "react";

export const Layout: React.FC<LayoutProps> = ({ pageTitle, children }) => {
  return (
    <div className={styles.container}>
      <header>
        <h1>My Gatsby Site</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.link}>
            Home
          </Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <main>
        <h2>{pageTitle}</h2>
        {children}
      </main>
      <footer className={styles.footer}>
        © {new Date().getFullYear()} My Gatsby Site
      </footer>
    </div>
  );
};
