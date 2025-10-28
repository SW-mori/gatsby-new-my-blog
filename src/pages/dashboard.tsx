import React from "react";
import { PrivateRoute } from "@components/PrivateRoute";
import { Dashboard } from "@components/Dashboard";
import { graphql } from "gatsby";

const DashboardPage: React.FC = () => {
  return (
    <PrivateRoute>
      <Dashboard />
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
