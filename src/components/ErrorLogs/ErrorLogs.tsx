import * as styles from "./ErrorLogs.module.scss";
import { useTranslation } from "react-i18next";
import { useErrorLogs } from "./hooks";

export const ErrorLogs = () => {
  const { t } = useTranslation("common");
  const { logs, loading, openId, toggleDetails } = useErrorLogs();

  if (loading) return <div className={styles.loading}>読み込み中...</div>;

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
              <th>{t("level")}</th>
              <th>{t("message")}</th>
              <th>{t("page")}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <>
                <tr
                  key={log.id}
                  className={styles[`level_${log.level ?? "error"}`]}
                  onClick={() => toggleDetails(log.id)}
                >
                  <td>{log.timestamp?.toDate().toLocaleString() ?? "-"}</td>
                  <td>{log.level ?? "error"}</td>
                  <td>{log.message}</td>
                  <td>{log.page ?? "-"}</td>
                </tr>
                {openId === log.id && (
                  <tr className={styles.detailsRow}>
                    <td colSpan={4}>
                      <pre className={styles.details}>
                        {log.details ?? t("noDetails")}
                      </pre>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
