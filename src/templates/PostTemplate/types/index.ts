import { FORM_STATUS } from "../constants";

export type FormStatus = (typeof FORM_STATUS)[keyof typeof FORM_STATUS];
