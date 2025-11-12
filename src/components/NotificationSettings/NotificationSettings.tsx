import { useNotificationSettings } from "./hooks";
import * as styles from "./NotificationSettings.module.scss";
import { useTranslation } from "react-i18next";

export const NotificationSettings = () => {
  const { t } = useTranslation("common");
  const { settings, loading, handleChange } = useNotificationSettings();

  if (loading) return <div className={styles.loading}>{t("loading")}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("errorNotificationSettings")}</h1>
      <p className={styles.description}>{t("selectErrorLevelsToNotify")}</p>

      <div className={styles.checkboxGroup}>
        {["error", "warning", "info"].map((level) => (
          <label key={level} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={settings.notificationLevel.includes(level)}
              onChange={() => handleChange(level)}
            />
            {t(level)}
          </label>
        ))}
      </div>
    </div>
  );
};
