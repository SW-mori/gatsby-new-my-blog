import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const USER_ID = "testUser";

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState({
    notificationLevel: [] as string[],
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const ref = doc(db, "userSettings", USER_ID);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setSettings(snap.data() as any);
      } else {
        await setDoc(ref, { notificationLevel: ["error"] });
        setSettings({ notificationLevel: ["error"] });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (levels: string[]) => {
    try {
      const ref = doc(db, "userSettings", USER_ID);
      await setDoc(ref, { notificationLevel: levels }, { merge: true });
      setSettings((prev) => ({ ...prev, notificationLevel: levels }));
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const handleChange = (level: string) => {
    const newLevels = settings.notificationLevel.includes(level)
      ? settings.notificationLevel.filter((l) => l !== level)
      : [...settings.notificationLevel, level];
    updateSettings(newLevels);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, updateSettings, handleChange };
};
