import { useTranslation } from "react-i18next";
import { useAuth } from "../../context";
import * as styles from "./Dashboard.module.scss";

export const Dashboard = () => {
  const { t } = useTranslation("common");
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <p className={styles.loading}>{t("loading")}</p>;
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <h1>{t("dashboard")}</h1>
        <p>{t("noUser")}</p>
      </div>
    );
  }

  const { email, uid, metadata } = user;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t("dashboard")}</h1>
        <ul className={styles.infoList}>
          <li>
            <strong>UID:</strong> {uid}
          </li>
          <li>
            <strong>{t("email")}:</strong> {email}
          </li>
          <li>
            <strong>{t("createdAt")}:</strong>
            {metadata?.creationTime
              ? new Date(metadata.creationTime).toLocaleString()
              : "N/A"}
          </li>
          <li>
            <strong>{t("lastLogin")}:</strong>
            {metadata?.lastSignInTime
              ? new Date(metadata.lastSignInTime).toLocaleString()
              : "N/A"}
          </li>
        </ul>
        <button className={styles.logoutButton} onClick={logout}>
          {t("logout")}
        </button>
      </div>
    </div>
  );
};
