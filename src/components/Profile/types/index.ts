import { PROFILE_STATUS } from "../constants";

export type ProfileStatus =
  (typeof PROFILE_STATUS)[keyof typeof PROFILE_STATUS];
