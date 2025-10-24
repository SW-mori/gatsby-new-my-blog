export const safeParse = (raw?: string) => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to parse Contentful rich text:", e);
    return null;
  }
};
