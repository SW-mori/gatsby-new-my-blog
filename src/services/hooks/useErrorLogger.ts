import { useCallback } from "react";
import { doc, setDoc, serverTimestamp, collection } from "firebase/firestore";
import { auth, db } from "../../firebase";

export const useErrorLogger = () => {
  const logError = useCallback(
    async (
      component: string,
      message: string,
      stack?: string,
      additional?: any
    ) => {
      const uid = auth.currentUser?.uid || null;
      const date = new Date().toISOString().split("T")[0];
      const docRef = doc(collection(db, `logs/errors/${date}`));

      try {
        await setDoc(docRef, {
          uid,
          component,
          message,
          stack,
          additional,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.error("Failed to log error to Firestore:", error);
      }
    },
    []
  );

  return { logError };
};
