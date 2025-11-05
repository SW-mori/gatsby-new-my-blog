import { PROFILE_STATUS } from "../constants";
import { ProfileStatus } from "../types";
import { useAuth } from "../../../context";
import { saveUserProfile, getUserProfile } from "../../../services";
import { FormEvent, useState, useEffect, useRef, ChangeEvent } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase";

export const useProfile = () => {
  const { user, updateProfileInfo } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [status, setStatus] = useState<ProfileStatus>(PROFILE_STATUS.IDLE);
  const [loading, setLoading] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
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
      } catch (e) {
        console.error("loadProfile error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      const avatarRef = ref(storage, `avatars/${user.uid}/${file.name}`);
      await uploadBytes(avatarRef, file);
      const url = await getDownloadURL(avatarRef);
      return url;
    } catch (e) {
      return null;
    }
  };

  const handleFileUpload = async (file: File) => {
    setStatus(PROFILE_STATUS.SAVING);
    const url = await uploadAvatar(file);
    if (!url) {
      setStatus(PROFILE_STATUS.ERROR);
      return;
    }

    try {
      const ok = await updateProfileInfo({ photoURL: url });
      if (!ok) throw new Error("updateProfileInfo failed");

      await saveUserProfile({
        uid: user!.uid,
        displayName,
        photoURL: url,
        updatedAt: Date.now(),
      });

      setPhotoURL(url);
      setStatus(PROFILE_STATUS.SUCCESS);
      setTimeout(() => setStatus(PROFILE_STATUS.IDLE), 2500);
    } catch (e) {
      setStatus(PROFILE_STATUS.ERROR);
    }
  };

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
    } catch (error) {
      setStatus(PROFILE_STATUS.ERROR);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setPhotoURL(preview);

    await handleFileUpload(file);
  };

  return {
    displayName,
    setDisplayName,
    photoURL,
    setPhotoURL,
    status,
    loading,
    handleSubmit,
    fileInputRef,
    handleFileChange,
  };
};
