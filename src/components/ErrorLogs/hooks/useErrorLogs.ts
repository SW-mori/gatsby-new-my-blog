import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { ErrorLog } from "../types";
import { useTranslation } from "react-i18next";

export const useErrorLogs = () => {
  const { t } = useTranslation("common");
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleDetails = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleDeleteLog = async (id: string) => {
    try {
      await deleteDoc(doc(db, "errorLogs", id));
      alert(t("deleteLog"));
    } catch (error) {
      alert(t("deleteFailed"));
    }
  };

  const handleDeleteAllLogs = async () => {
    if (!window.confirm(t("logDelete"))) return;

    try {
      const querySnapshot = await getDocs(collection(db, "errorLogs"));
      const deletions = querySnapshot.docs.map((d) =>
        deleteDoc(doc(db, "errorLogs", d.id))
      );
      await Promise.all(deletions);
      alert(t("deleteAllLog"));
    } catch (error) {
      alert(t("deleteFailed"));
    }
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const q = query(
          collection(db, "errorLogs"),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ErrorLog[];
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return {
    logs,
    loading,
    openId,
    toggleDetails,
    handleDeleteAllLogs,
    handleDeleteLog,
  };
};
