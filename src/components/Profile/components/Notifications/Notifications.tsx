import { FC } from "react";
import { useUserSettings } from "./hooks";
import { PROFILE_STATUS } from "../../constants";
import { useTranslation } from "react-i18next";
import * as styles from "./Notifications.module.scss";
import { SETTINGS_TEST_ID } from "../../../../../cypress";

export const Notifications: FC = () => {
  const { t } = useTranslation("common");
  const { settings, updateSetting, loading, status } = useUserSettings();

  if (loading) {
    return <p className={styles.loading}>{t("loading")}</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("notificationSettings")}</h2>
      <div className={styles.toggleGroup}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) =>
              updateSetting("emailNotifications", e.target.checked)
            }
            data-testid={SETTINGS_TEST_ID.CHECK("email")}
          />
          {t("emailNotifications")}
        </label>

        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={settings.commentNotifications}
            onChange={(e) =>
              updateSetting("commentNotifications", e.target.checked)
            }
            data-testid={SETTINGS_TEST_ID.CHECK("comment")}
          />
          {t("commentNotifications")}
        </label>

        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={settings.securityAlerts}
            onChange={(e) => updateSetting("securityAlerts", e.target.checked)}
            data-testid={SETTINGS_TEST_ID.CHECK("security")}
          />
          {t("securityAlerts")}
        </label>
      </div>
      {status === PROFILE_STATUS.SAVING && (
        <p className={styles.saving}>{t("saving")}</p>
      )}
      {status === PROFILE_STATUS.SUCCESS && (
        <p className={styles.success}>{t("settingsSaved")}</p>
      )}
      {status === PROFILE_STATUS.ERROR && (
        <p className={styles.error}>{t("settingsSaveError")}</p>
      )}
    </div>
  );
};
