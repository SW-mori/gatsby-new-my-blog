import { PROFILE_STATUS } from "../constants";
import { ProfileStatus } from "../types";
import { useAuth } from "../../../context";
import { saveUserProfile, getUserProfile } from "../../../services";
import { FormEvent, useState, useEffect, useRef, ChangeEvent } from "react";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { app } from "../../../firebase";
import { setLogLevel } from "firebase/firestore";
import { useErrorLogger } from "../../../services";

export const useProfile = () => {
  const { user, updateProfileInfo } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [status, setStatus] = useState<ProfileStatus>(PROFILE_STATUS.IDLE);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const storage = getStorage(app);
  const { logError } = useErrorLogger();

  useEffect(() => {
    const loadProfile = async () => {
      if (typeof window === "undefined" || !user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getUserProfile(user.uid);
        if (data) {
          setDisplayName(data.displayName ?? user.displayName ?? "");
          setPhotoURL(data.photoURL ?? user.photoURL ?? "");
        } else {
          setDisplayName(user.displayName ?? "");
          setPhotoURL(user.photoURL ?? "");
        }
      } catch (e: any) {
        console.error("loadProfile error:", e);
        logError("useProfile", e.message, e.stack);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  setLogLevel("error");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setStatus(PROFILE_STATUS.SAVING);

    try {
      const ok = await updateProfileInfo({
        displayName: displayName.trim() || null,
        photoURL: photoURL.trim() || null,
      });

      if (!ok) throw new Error("updateProfileInfo failed");

      await saveUserProfile({
        uid: user.uid,
        displayName: displayName.trim() || null,
        photoURL: photoURL.trim() || null,
        updatedAt: Date.now(),
      });

      setStatus(PROFILE_STATUS.SUCCESS);
      setTimeout(() => setStatus(PROFILE_STATUS.IDLE), 2500);
    } catch (e: any) {
      setStatus(PROFILE_STATUS.ERROR);
      logError("useProfile", e.message, e.stack);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !user) return;
    const file = e.target.files[0];
    setUploading(true);

    try {
      const filePath = `users/${user.uid}/profile/${file.name}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const ok = await updateProfileInfo({ photoURL: url });
      if (ok) {
        await saveUserProfile({
          uid: user.uid,
          displayName: displayName.trim() || null,
          photoURL: url,
          updatedAt: Date.now(),
        });
        setPhotoURL(url);
      }

      setStatus(PROFILE_STATUS.SUCCESS);
      setTimeout(() => setStatus(PROFILE_STATUS.IDLE), 2500);
    } catch (e: any) {
      setStatus(PROFILE_STATUS.ERROR);
      logError("useProfile", e.message, e.stack);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeletePhoto = async () => {
    if (!user || !photoURL) return;
    setDeleting(true);

    try {
      const fileRef = ref(storage, photoURL);
      await deleteObject(fileRef).catch(() =>
        console.warn("Storage file not found, skipping delete.")
      );

      const ok = await updateProfileInfo({ photoURL: null });
      if (ok) {
        await saveUserProfile({
          uid: user.uid,
          displayName: displayName.trim() || null,
          photoURL: null,
          updatedAt: Date.now(),
        });
        setPhotoURL("");
      }

      setStatus(PROFILE_STATUS.SUCCESS);
      setTimeout(() => setStatus(PROFILE_STATUS.IDLE), 2500);
    } catch (e: any) {
      setStatus(PROFILE_STATUS.ERROR);
      logError("useProfile", e.message, e.stack);
    } finally {
      setDeleting(false);
    }
  };

  return {
    displayName,
    setDisplayName,
    photoURL,
    setPhotoURL,
    status,
    loading,
    uploading,
    deleting,
    handleSubmit,
    handleFileChange,
    handleDeletePhoto,
    fileInputRef,
  };
};
