import { PROFILE_STATUS } from "../constants";
import { ProfileStatus } from "../types";
import { useAuth } from "../../../context";
import { FormEvent, useState } from "react";

export const useProfile = () => {
  const { user, updateProfileInfo } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL ?? "");
  const [status, setStatus] = useState<ProfileStatus>(PROFILE_STATUS.IDLE);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setStatus(PROFILE_STATUS.SAVING);

    try {
      const ok = await updateProfileInfo({
        displayName: displayName.trim() || null,
        photoURL: photoURL.trim() || null,
      });

      if (ok) {
        setStatus(PROFILE_STATUS.SUCCESS);
        setTimeout(() => setStatus(PROFILE_STATUS.IDLE), 2500);
      } else {
        setStatus(PROFILE_STATUS.ERROR);
      }
    } catch (error) {
      console.error("updateProfileInfo error:", error);
      setStatus(PROFILE_STATUS.ERROR);
    }
  };

  return {
    displayName,
    setDisplayName,
    photoURL,
    setPhotoURL,
    status,
    handleSubmit,
  };
};
