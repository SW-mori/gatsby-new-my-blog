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
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { navigate } from "gatsby";
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const mountedRef = useRef<boolean>(true);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    mountedRef.current = true;

    if (typeof window === "undefined") {
      setLoading(false);
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      const current = auth.currentUser;
      if (current) {
        setUser(current);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.warn("Auth currentUser check failed:", e);
    }

    timeoutRef.current = window.setTimeout(() => {
      if (!mountedRef.current) return;
      setLoading(false);
    }, 10000);

    const unsubscribe: Unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (!mountedRef.current) return;
        setUser(firebaseUser);
        setIsAuthenticated(!!firebaseUser);
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
        setLoading(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = undefined;
        }
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

      if (typeof window !== "undefined") {
        navigate("/login");
      }
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

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    logout,
    refreshIdToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
