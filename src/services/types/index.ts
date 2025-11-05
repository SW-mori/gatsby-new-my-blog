export type UserProfile = {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  bio?: string;
  updatedAt: number;
};
