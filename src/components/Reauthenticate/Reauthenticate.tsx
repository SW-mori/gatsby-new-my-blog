import { FormEvent, useState } from "react";
import { useAuth } from "../../context";
import { useTranslation } from "react-i18next";
import * as styles from "./Reauthenticate.module.scss";

export const Reauthenticate = ({ onSuccess }: { onSuccess: () => void }) => {
  const { t } = useTranslation("common");
  const { reauthenticate, user } = useAuth();
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const ok = await reauthenticate(email, password);
    setLoading(false);

    if (ok) {
      onSuccess();
    } else {
      setError(t("reauthenticateFailed"));
    }
  };

  return (
    <div className={styles.container}>
      <h2>{t("reauthenticateTitle")}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="email" value={email} readOnly className={styles.input} />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("password")}
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? t("authenticating") : t("confirm")}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};
