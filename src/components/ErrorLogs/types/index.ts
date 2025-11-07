import { Timestamp } from "firebase/firestore";

export type ErrorLog = {
  id: string;
  message: string;
  stack?: string;
  page?: string;
  timestamp?: Timestamp;
};

export type ErrorLogProps = {
  logs: ErrorLog[];
};
