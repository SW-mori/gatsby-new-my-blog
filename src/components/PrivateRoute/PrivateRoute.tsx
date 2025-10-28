import { FC, ReactNode } from "react";
import { navigate } from "gatsby";
import { useAuth } from "../../context";
import * as styles from "./PrivateRoute.module.scss";

export const PrivateRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className={styles.container}>読み込み中...</p>;
  }

  if (!user) {
    if (typeof window !== "undefined") {
      navigate("/login");
    }
    return null;
  }

  return <>{children}</>;
};
