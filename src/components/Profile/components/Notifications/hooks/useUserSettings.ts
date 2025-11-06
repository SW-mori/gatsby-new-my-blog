import { useEffect, useState, useCallback } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { PROFILE_STATUS } from "../../../constants";
import { ProfileStatus } from "../../../types";
import { auth, db } from "../../../../../firebase";
import { useErrorLogger } from "../../../../../services";
import { UserSettings } from "../types";

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: false,
    commentNotifications: false,
    securityAlerts: false,
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ProfileStatus | null>(null);
  const { logError } = useErrorLogger();

  const fetchSettings = useCallback(async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    setLoading(true);
    try {
      const docRef = doc(db, "userSettings", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as UserSettings);
      } else {
        console.log(
          "User settings document does not exist yet. Using default settings."
        );
      }
    } catch (error: any) {
      console.error("Failed to fetch user settings:", error);
      if (error.code === "unavailable") {
        console.warn("Client is offline. Using default settings.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchSettings();
      } else {
        setLoading(false);
      }
    });

    const handleOnline = () => {
      if (auth.currentUser) fetchSettings();
    };
    window.addEventListener("online", handleOnline);

    return () => {
      unsubscribe();
      window.removeEventListener("online", handleOnline);
    };
  }, [fetchSettings]);

  const updateSetting = async (field: keyof UserSettings, value: boolean) => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      return;
    }

    const updated = { ...settings, [field]: value };
    setSettings(updated);
    setStatus(PROFILE_STATUS.SAVING);

    try {
      const docRef = doc(db, "userSettings", uid);
      await setDoc(
        docRef,
        { ...updated, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setStatus(PROFILE_STATUS.SUCCESS);
    } catch (error: any) {
      console.error("Failed to save user settings:", error);
      setStatus(PROFILE_STATUS.ERROR);
      logError("useUserSettings", error.message, error.stack, { field });
    }
  };

  return { settings, updateSetting, loading, status };
};
