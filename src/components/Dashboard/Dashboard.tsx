import { useTranslation } from "react-i18next";
import { useAuth } from "../../context";
import * as styles from "./Dashboard.module.scss";

export const Dashboard = () => {
  const { t } = useTranslation("common");
  const { user, logout } = useAuth();

  return (
    <div className={styles.container}>
      <h1>{t("dashboard")}</h1>
      {user && (
        <>
          <p>
            {t("loginUser")}
            {user.email}
          </p>
          <button className={styles.button} onClick={logout}>
            {t("logout")}
          </button>
        </>
      )}
    </div>
  );
};
