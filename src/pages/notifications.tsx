import { type FC } from "react";
import { graphql } from "gatsby";
import { Notifications } from "@components/Notifications";

const NotificationsPage: FC = () => {
  return <Notifications />;
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
