import { ErrorLogProps } from "./types";
import * as styles from "./ErrorLogs.module.scss";
import { useTranslation } from "react-i18next";

export const ErrorLogs = ({ logs }: ErrorLogProps) => {
  const { t } = useTranslation("common");
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("errorLogs")}</h1>
      {logs.length === 0 ? (
        <p>{t("notErrorLogs")}</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t("date")}</th>
              <th>{t("message")}</th>
              <th>{t("page")}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.timestamp?.toDate().toLocaleString() ?? "-"}</td>
                <td>{log.message}</td>
                <td>{log.page ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
