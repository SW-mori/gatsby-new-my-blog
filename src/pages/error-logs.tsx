import React from "react";
import { Layout } from "@components/Layout";
import { ErrorLogs } from "@components/ErrorLogs/ErrorLogs";
import { graphql } from "gatsby";

const ErrorLogsPage: React.FC = () => {
  return (
    <Layout>
      <ErrorLogs />
    </Layout>
  );
};

export default ErrorLogsPage;

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
