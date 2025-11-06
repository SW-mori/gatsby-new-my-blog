import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as styles from "./UpdatePassword.module.scss";
import { Reauthenticate } from "../../../Reauthenticate";
import { useAuth } from "../../../../context";
import { ProfileStatus } from "../../../../types";
import { PROFILE_STATUS } from "../../../../constants";

export const UpdatePassword = () => {
  const { t } = useTranslation("common");
  const { updatePasswordSecure } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showReauth, setShowReauth] = useState(false);
  const [status, setStatus] = useState<ProfileStatus>(PROFILE_STATUS.IDLE);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus(PROFILE_STATUS.SAVING);

    try {
      const ok = await updatePasswordSecure(currentPassword, newPassword);
      if (ok) {
        setStatus(PROFILE_STATUS.SUCCESS);
        setCurrentPassword("");
        setNewPassword("");
        setTimeout(() => setStatus(PROFILE_STATUS.IDLE), 3000);
      } else {
        setShowReauth(true);
      }
    } catch (err) {
      setError(t("passwordUpdateFailed"));
      setStatus(PROFILE_STATUS.ERROR);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("updatePassword")}</h2>
      {showReauth ? (
        <Reauthenticate onSuccess={() => setShowReauth(false)} />
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            placeholder={t("currentPassword")}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder={t("newPassword")}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
          />
          <button
            type="submit"
            disabled={status === PROFILE_STATUS.SUCCESS}
            className={styles.button}
          >
            {status === PROFILE_STATUS.SAVING
              ? t("saving")
              : status === PROFILE_STATUS.SUCCESS
              ? t("saved")
              : t("save")}
          </button>
        </form>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {status === PROFILE_STATUS.SUCCESS && (
        <p className={styles.success}>{t("passwordUpdateSuccess")}</p>
      )}
    </div>
  );
};
