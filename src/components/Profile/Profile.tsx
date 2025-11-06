import { useProfile } from "./hooks";
import { useTranslation } from "react-i18next";
import * as styles from "./Profile.module.scss";
import { PROFILE_STATUS } from "./constants";
import { DeleteAccount, Notifications, UpdatePassword } from "./components";

export const Profile = () => {
  const { t } = useTranslation("common");
  const {
    displayName,
    setDisplayName,
    photoURL,
    setPhotoURL,
    status,
    loading,
    uploading,
    deleting,
    handleSubmit,
    fileInputRef,
    handleFileChange,
    handleDeletePhoto,
  } = useProfile();

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>{t("loading")}</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>{t("profileSettings")}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              {photoURL ? (
                <img src={photoURL} alt="Profile" className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>{t("noImage")}</div>
              )}
            </div>
            <div className={styles.avatarActions}>
              <button
                type="button"
                className={styles.uploadButton}
                onClick={() => fileInputRef.current?.click()}
                disabled={
                  uploading || deleting || status === PROFILE_STATUS.SAVING
                }
              >
                {uploading ? t("uploading") : t("changePhoto")}
              </button>
              {photoURL && (
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={handleDeletePhoto}
                  disabled={
                    deleting || uploading || status === PROFILE_STATUS.SAVING
                  }
                >
                  {deleting ? t("deleting") : t("removePhoto")}
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.hiddenInput}
            />
          </div>
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
            disabled={uploading || deleting || status === PROFILE_STATUS.SAVING}
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
      <UpdatePassword />
      <DeleteAccount />
      <Notifications />
    </>
  );
};
