import { useTranslation } from "react-i18next";
import { useLogin } from "./hooks";
import * as styles from "./Login.module.scss";

export const Login = () => {
  const { t } = useTranslation("common");
  const { email, error, loading, password, handleLogin, onChange } = useLogin();
  const { onChangeEmail, onChangePassword } = onChange;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t("login")}</h1>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">{t("email")}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={onChangeEmail}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">{t("password")}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={onChangePassword}
              required
            />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? t("loadingLogin") : t("login")}
          </button>
        </form>
      </div>
    </div>
  );
};
