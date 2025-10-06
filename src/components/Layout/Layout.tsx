import * as React from "react";
import { Link } from "gatsby";
import { LayoutProps } from "./types";

export const Layout: React.FC<LayoutProps> = ({ pageTitle, children }) => {
  return (
    <div style={{ margin: "0 auto", maxWidth: "700px", padding: "1rem" }}>
      <header>
        <h1>My Gatsby Site</h1>
        <nav style={{ marginBottom: "1rem" }}>
          <Link to="/" style={{ marginRight: "1rem" }}>
            Home
          </Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <main>
        <h2>{pageTitle}</h2>
        {children}
      </main>
      <footer style={{ marginTop: "2rem", fontSize: "0.8rem" }}>
        © {new Date().getFullYear()} My Gatsby Site
      </footer>
    </div>
  );
};
