import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserProfile } from "./types";
import { db } from "../firebase";

export const saveUserProfile = async (profile: UserProfile) => {
  const ref = doc(db, "users", profile.uid);
  await setDoc(ref, profile, { merge: true });
};

export const getUserProfile = async (
  uid: string
): Promise<Partial<UserProfile> | null> => {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as Partial<UserProfile>;
    }
    return null;
  } catch (error) {
    console.error("fetchUserProfile failed:", error);
    return null;
  }
};
