import { FC, ReactNode } from "react";
import { navigate } from "gatsby";
import { useAuth } from "../../context";
import * as styles from "./PrivateRoute.module.scss";
import { useTranslation } from "react-i18next";

export const PrivateRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation("common");
  const { user, loading } = useAuth();

  if (loading) {
    return <p className={styles.container}>{t("loading")}</p>;
  }

  if (!user) {
    if (typeof window !== "undefined") {
      navigate("/login");
    }
    return null;
  }

  return <>{children}</>;
};
