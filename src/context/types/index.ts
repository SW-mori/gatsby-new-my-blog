import type { User } from "firebase/auth";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshIdToken: () => Promise<string | null>;
};
