import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: "My Gatsby Site",
    description: "これは Gatsby + TypeScript の学習用サイトです",
  },
  graphqlTypegen: true,
  plugins: [],
};

export default config;
