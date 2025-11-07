import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase";
import { ErrorLog } from "../types";

export const useErrorLogs = () => {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const q = query(
          collection(db, "errorLogs"),
          orderBy("timestamp", "desc")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ErrorLog[];
        setLogs(data);
      } catch (error) {
        console.error("Failed to load error logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return { logs, loading };
};
