import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import { safeParse } from "./safeParse";

export const safePlainText = (raw?: string) => {
  const parsed = safeParse(raw);
  if (!parsed) return "";
  try {
    return documentToPlainTextString(parsed);
  } catch (e) {
    console.warn("Failed to convert Contentful rich text to plain text:", e);
    return "";
  }
};
