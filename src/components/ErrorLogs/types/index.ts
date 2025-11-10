import { Timestamp } from "firebase/firestore";
import { LOG_LEVEL } from "../constants";

export type ErrorLog = {
  id: string;
  message: string;
  details?: string;
  page?: string;
  timestamp?: Timestamp;
  level?: (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL];
};
