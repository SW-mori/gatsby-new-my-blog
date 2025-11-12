import * as styles from "./ErrorLogs.module.scss";
import { useTranslation } from "react-i18next";
import { useErrorLogs } from "./hooks";
import { Fragment } from "react";

export const ErrorLogs = () => {
  const { t } = useTranslation("common");

  const {
    logs,
    loading,
    openId,
    toggleDetails,
    handleDeleteAllLogs,
    handleDeleteLog,
    filter,
    setFilter,
  } = useErrorLogs();

  if (loading) return <div className={styles.loading}>{t("loading")}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("errorLogs")}</h1>

      <div className={styles.filterArea}>
        <label htmlFor="filter">{t("filter")}：</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">{t("all")}</option>
          <option value="error">{t("error")}</option>
          <option value="warning">{t("warning")}</option>
          <option value="info">{t("info")}</option>
        </select>
      </div>

      {logs.length === 0 ? (
        <p>{t("notErrorLogs")}</p>
      ) : (
        <>
          <div className={styles.actions}>
            <button
              className={styles.deleteAllButton}
              onClick={handleDeleteAllLogs}
            >
              {t("deleteAll")}
            </button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t("date")}</th>
                <th>{t("level")}</th>
                <th>{t("message")}</th>
                <th>{t("page")}</th>
                <th>{t("delete")}</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <Fragment key={log.id}>
                  <tr
                    key={log.id}
                    className={styles[`level_${log.level ?? "error"}`]}
                    onClick={() => toggleDetails(log.id)}
                  >
                    <td>
                      {log.timestamp ? log.timestamp.toLocaleString() : "-"}
                    </td>
                    <td>{log.level ?? "error"}</td>
                    <td>{log.message}</td>
                    <td>{log.page ?? "-"}</td>
                    <td>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLog(log.id);
                        }}
                      >
                        {t("delete")}
                      </button>
                    </td>
                  </tr>
                  {openId === log.id && (
                    <tr className={styles.detailsRow}>
                      <td colSpan={5}>
                        <pre className={styles.details}>
                          {log.details ?? t("noDetails")}
                        </pre>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
