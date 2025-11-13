import {
  createContext,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  onIdTokenChanged,
  signOut,
  getIdToken,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  type User,
  type Unsubscribe,
  updatePassword,
} from "firebase/auth";
import { navigate } from "gatsby";
import { AuthContextType } from "./types";
import { auth, db } from "../firebase";
import { useTranslation } from "react-i18next";
import { doc, deleteDoc } from "firebase/firestore";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation("common");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [needsReauth, setNeedsReauth] = useState<boolean>(false);

  const mountedRef = useRef<boolean>(true);
  const refreshRetryRef = useRef<number>(0);
  const maxRetries = 3;

  useEffect(() => {
    mountedRef.current = true;

    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const unsubscribeAuth: Unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!mountedRef.current) return;

        if (firebaseUser) {
          setUser(firebaseUser);
          setIsAuthenticated(true);
          setError(null);
          await tryRefreshToken(firebaseUser);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      },
      (err) => {
        console.error("onAuthStateChanged error:", err);
        if (!mountedRef.current) return;
        setUser(null);
        setIsAuthenticated(false);
        setError(t("authenticationError"));
        setLoading(false);
        navigate("/login");
      }
    );

    const unsubscribeToken: Unsubscribe = onIdTokenChanged(
      auth,
      async (firebaseUser) => {
        if (!firebaseUser) return;
        await tryRefreshToken(firebaseUser);
      }
    );

    return () => {
      mountedRef.current = false;
      unsubscribeAuth();
      unsubscribeToken();
    };
  }, []);

  const tryRefreshToken = async (firebaseUser: User) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const token = await getIdToken(firebaseUser, true);
        console.log("Token refreshed:", token.slice(0, 10), "...");
        refreshRetryRef.current = 0;
        setNeedsReauth(false);
        setError(null);
        return token;
      } catch (err) {
        refreshRetryRef.current++;
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
    setNeedsReauth(true);
    setError(t("updateToken"));
    await logout();
  };

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
      setError(t("logoutError"));
      throw e;
    }
  };

  const refreshIdToken = async (): Promise<string | null> => {
    if (!auth.currentUser) return null;
    try {
      return (await tryRefreshToken(auth.currentUser)) as string;
    } catch {
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
      setError(t("profileUpdateError"));
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
      setNeedsReauth(false);
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
      setNeedsReauth(true);
      return false;
    }
  };

  const deleteUserAccount = async (): Promise<boolean> => {
    if (!auth.currentUser || !auth.currentUser.email) return false;
    try {
      await deleteDoc(doc(db, "users", auth.currentUser.uid));
      await deleteUser(auth.currentUser);
      return true;
    } catch (error: any) {
      setNeedsReauth(true);
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
    deleteUserAccount,
    needsReauth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
