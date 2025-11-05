import { DELETE_STATUS } from "../constants";

export type DeleteStatus = (typeof DELETE_STATUS)[keyof typeof DELETE_STATUS];
