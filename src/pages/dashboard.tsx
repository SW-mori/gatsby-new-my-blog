import React from "react";
import { PrivateRoute } from "@components/PrivateRoute";
import { Dashboard } from "@components/Dashboard";
import { Layout } from "@components/Layout";
import { graphql } from "gatsby";

const DashboardPage: React.FC = () => {
  return (
    <PrivateRoute>
      <Layout>
        <Dashboard />
      </Layout>
    </PrivateRoute>
  );
};

export default DashboardPage;

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
