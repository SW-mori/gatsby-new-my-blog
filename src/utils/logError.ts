export const logErrorToServer = async (
  error: Error,
  extra?: Record<string, any>
) => {
  try {
    await fetch("/__/functions/logError", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        ...extra,
      }),
    });
  } catch (err) {
    console.error("Failed to send error log:", err);
  }
};
