import React from "react";
import { Layout } from "@components/Layout";
import { useErrorLogs } from "@components/ErrorLogs/hooks";
import { ErrorLogs } from "@components/ErrorLogs/ErrorLogs";
import { graphql } from "gatsby";

const ErrorLogsPage: React.FC = () => {
  const { logs, loading } = useErrorLogs();

  if (loading) return <Layout>読み込み中...</Layout>;

  return (
    <Layout>
      <ErrorLogs logs={logs} />
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
