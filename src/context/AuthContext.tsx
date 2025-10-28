import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signOut,
  getIdToken,
  type User,
} from "firebase/auth";
import { AuthContextType } from "./types";
import { auth } from "../firebase";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      },
      (error) => {
        console.error("onAuthStateChanged error:", error);
        setUser(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("logout failed:", e);
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
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshIdToken }}>
      {children}
    </AuthContext.Provider>
  );
};
