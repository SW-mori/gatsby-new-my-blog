import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ErrorLog } from "../types";

export const useErrorLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const toggleDetails = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(
        query(collection(db, "errorLogs"), orderBy("timestamp", "desc"))
      );

      const logsData: ErrorLog[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as {
          timestamp: any;
          level?: string;
          message?: string;
          detail?: string | null;
          page?: string | null;
          userId?: string | null;
        };

        return {
          id: docSnap.id,
          timestamp: data.timestamp?.toDate
            ? data.timestamp.toDate()
            : new Date(data.timestamp),
          level: (data.level as "error" | "warning" | "info") ?? "error",
          message: data.message ?? "-",
          detail: data.detail ?? null,
          page: data.page ?? "-",
          userId: data.userId ?? null,
        };
      });
      const filteredLogs =
        filter === "all"
          ? logsData
          : logsData.filter((log) => log.level === filter);

      setLogs(filteredLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const handleDeleteLog = async (id: string) => {
    await deleteDoc(doc(db, "errorLogs", id));
    fetchLogs();
  };

  const handleDeleteAllLogs = async () => {
    const snapshot = await getDocs(collection(db, "errorLogs"));
    const deletions = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "errorLogs", docSnap.id))
    );
    await Promise.all(deletions);
    fetchLogs();
  };

  return {
    logs,
    loading,
    openId,
    toggleDetails,
    handleDeleteLog,
    handleDeleteAllLogs,
    filter,
    setFilter,
  };
};
