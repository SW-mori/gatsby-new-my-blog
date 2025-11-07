import { ErrorLogProps } from "./types";
import * as styles from "./ErrorLogs.module.scss";

export const ErrorLogs = ({ logs }: ErrorLogProps) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>エラーログ一覧</h1>
      {logs.length === 0 ? (
        <p>現在エラーログはありません。</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>日時</th>
              <th>メッセージ</th>
              <th>ページ</th>
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
