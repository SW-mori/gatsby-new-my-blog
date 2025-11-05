import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signOut,
  getIdToken,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  type User,
  type Unsubscribe,
  updatePassword,
} from "firebase/auth";
import { navigate } from "gatsby";
import { AuthContextType } from "./types";
import { auth } from "../firebase";
import { useTranslation } from "react-i18next";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation("common");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef<boolean>(true);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    mountedRef.current = true;

    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      if (!mountedRef.current) return;
      setLoading(false);
    }, 10000);

    const unsubscribe: Unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!mountedRef.current) return;

        if (firebaseUser) {
          try {
            await getIdToken(firebaseUser, true);
            setUser(firebaseUser);
            setIsAuthenticated(true);
            setError(null);
          } catch (e) {
            console.error("Token refresh error:", e);
            setError(t("noSession"));
            setUser(null);
            setIsAuthenticated(false);
            navigate("/login");
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }

        setLoading(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = undefined;
        }
      },
      (error) => {
        console.error("onAuthStateChanged error:", error);
        if (!mountedRef.current) return;
        setUser(null);
        setIsAuthenticated(false);
        setError(t("authenticationError"));
        setLoading(false);
        navigate("/login");
      }
    );

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);

      try {
        localStorage.removeItem("some-app-cache-key");
        localStorage.removeItem("firebase:authUser");
      } catch (e) {
        console.warn("localStorage clear failed:", e);
      }

      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (e) {
      console.error("logout failed:", e);
      setError(t("logoutError"));
      throw e;
    }
  };

  const refreshIdToken = async (): Promise<string | null> => {
    if (!auth.currentUser) return null;
    try {
      const token = await getIdToken(auth.currentUser, true);
      return token;
    } catch (e) {
      console.error("refreshIdToken failed:", e);
      setError(t("updateToken"));
      return null;
    }
  };

  const updateProfileInfo = async (payload: {
    displayName?: string | null;
    photoURL?: string | null;
  }): Promise<boolean> => {
    if (!auth.currentUser) return false;
    try {
      await updateProfile(auth.currentUser, {
        ...(payload.displayName !== undefined
          ? { displayName: payload.displayName }
          : {}),
        ...(payload.photoURL !== undefined
          ? { photoURL: payload.photoURL }
          : {}),
      });
      setUser({ ...auth.currentUser });
      setIsAuthenticated(!!auth.currentUser);
      return true;
    } catch (e) {
      return false;
    }
  };

  const reauthenticate = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    if (!auth.currentUser) return false;
    try {
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);
      return true;
    } catch (error) {
      return false;
    }
  };

  const updatePasswordSecure = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    if (!auth.currentUser || !auth.currentUser.email) return false;

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      await updatePassword(auth.currentUser, newPassword);
      return true;
    } catch (error) {
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    logout,
    refreshIdToken,
    error,
    updateProfileInfo,
    reauthenticate,
    updatePasswordSecure,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
