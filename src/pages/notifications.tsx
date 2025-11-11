import { graphql } from "gatsby";
import { Layout } from "@components/Layout";
import { NotificationSettings } from "@components/NotificationSettings";

const NotificationsPage = () => {
  return (
    <Layout>
      <NotificationSettings />
    </Layout>
  );
};

export default NotificationsPage;

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
