import React from "react";
import { PrivateRoute } from "@components/PrivateRoute";
import { Profile } from "@components/Profile";
import { graphql } from "gatsby";

const ProfilePage: React.FC = () => {
  return (
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  );
};

export default ProfilePage;

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
