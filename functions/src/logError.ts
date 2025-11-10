import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const logError = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const { message, detail, userId, page, level, timestamp } = req.body;

    if (!message) {
      res.status(400).json({ error: "message is required" });
      return;
    }

    await db.collection("errorLogs").add({
      message,
      detail: detail || null,
      userId: userId || null,
      page: page || null,
      timestamp: timestamp
        ? admin.firestore.Timestamp.fromDate(new Date(timestamp))
        : admin.firestore.Timestamp.now(),
      level: level || "error",
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Error saving log:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
