import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as styles from "./DeleteAccount.module.scss";
import { Reauthenticate } from "../../../Reauthenticate";
import { useAuth } from "../../../../context";
import { DeleteStatus } from "./types";
import { DELETE_STATUS } from "./constants";

export const DeleteAccount = () => {
  const { t } = useTranslation("common");
  const { deleteUserAccount } = useAuth();
  const [confirm, setConfirm] = useState("");
  const [showReauth, setShowReauth] = useState(false);
  const [status, setStatus] = useState<DeleteStatus>(DELETE_STATUS.IDLE);
  const [error, setError] = useState("");

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirm !== "DELETE") {
      setError(t("deleteConfirmError"));
      return;
    }

    setError("");
    setStatus(DELETE_STATUS.DELETING);

    try {
      const ok = await deleteUserAccount();
      if (ok) {
        setStatus(DELETE_STATUS.SUCCESS);
      } else {
        setShowReauth(true);
      }
    } catch (err) {
      setError(t("deleteAccountFailed"));
      setStatus(DELETE_STATUS.ERROR);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("deleteAccount")}</h2>
      {showReauth ? (
        <Reauthenticate onSuccess={() => setShowReauth(false)} />
      ) : (
        <form onSubmit={handleDelete} className={styles.form}>
          <p className={styles.warning}>{t("deleteWarning")}</p>
          <input
            type="text"
            placeholder="Type DELETE to confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={styles.input}
          />
          <button
            type="submit"
            className={styles.deleteButton}
            disabled={status === DELETE_STATUS.DELETING}
          >
            {status === DELETE_STATUS.DELETING
              ? t("deleting")
              : status === DELETE_STATUS.SUCCESS
              ? t("deleted")
              : t("delete")}
          </button>
        </form>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {status === DELETE_STATUS.SUCCESS && (
        <p className={styles.success}>{t("accountDeleted")}</p>
      )}
    </div>
  );
};
