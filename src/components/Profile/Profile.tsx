import { useProfile } from "./hooks";
import { useTranslation } from "react-i18next";
import * as styles from "./Profile.module.scss";
import { PROFILE_STATUS } from "./constants";

export const Profile = () => {
  const { t } = useTranslation("common");
  const {
    displayName,
    setDisplayName,
    photoURL,
    setPhotoURL,
    status,
    handleSubmit,
  } = useProfile();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("profileSettings")}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          {t("displayName")}
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          {t("photoUrl")}
          <input
            type="url"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            className={styles.input}
          />
        </label>
        <button
          type="submit"
          className={styles.button}
          disabled={status === PROFILE_STATUS.SAVING}
        >
          {status === PROFILE_STATUS.SAVING
            ? t("saving")
            : status === PROFILE_STATUS.SUCCESS
            ? t("saved")
            : t("save")}
        </button>
      </form>

      {status === PROFILE_STATUS.SUCCESS && (
        <p className={styles.success}>{t("profileUpdateSuccess")}</p>
      )}
      {status === PROFILE_STATUS.ERROR && (
        <p className={styles.error}>{t("profileUpdateError")}</p>
      )}
    </div>
  );
};
