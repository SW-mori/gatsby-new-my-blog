import { ReactNode } from "react";
import { AuthProvider } from "./src/context/AuthContext";

export const wrapRootElement = ({ element }: { element: ReactNode }) => {
  return <AuthProvider>{element}</AuthProvider>;
};
