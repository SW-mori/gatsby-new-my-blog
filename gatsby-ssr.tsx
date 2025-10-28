import React from "react";
import { AuthProvider } from "./src/context/AuthContext";

export const wrapRootElement = ({ element }: { element: React.ReactNode }) => {
  return <AuthProvider>{element}</AuthProvider>;
};
