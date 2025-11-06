import React from "react";
import { PrivateRoute } from "@components/PrivateRoute";
import { Profile } from "@components/Profile";
import { graphql } from "gatsby";
import { Layout } from "@components/Layout";

const SettingsPage: React.FC = () => {
  return (
    <PrivateRoute>
      <Layout>
        <Profile />
      </Layout>
    </PrivateRoute>
  );
};

export default SettingsPage;

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
