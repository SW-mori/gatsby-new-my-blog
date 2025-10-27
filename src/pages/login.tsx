import { type FC } from "react";
import { graphql } from "gatsby";
import { Login } from "@components/Login";

const LoginPage: FC = () => {
  return <Login />;
};

export default LoginPage;

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
