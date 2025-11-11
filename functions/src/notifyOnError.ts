import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { setGlobalOptions } from "firebase-functions/v2/options";
import * as admin from "firebase-admin";
import fetch from "node-fetch";

setGlobalOptions({ region: "asia-northeast1" });

if (!admin.apps.length) {
  admin.initializeApp();
}

const SLACK_WEBHOOK_URL =
  process.env.SLACK_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL_FALLBACK || "";

export const notifyOnError = onDocumentCreated(
  "errorLogs/{logId}",
  async (event) => {
    const logData = event.data?.data();
    if (!logData) return;

    const { level, message, page, detail, timestamp } = logData;

    if (level !== "error") return;

    const slackMessage = {
      text: `🚨 *Error Detected!*\n*Message:* ${message}\n*Page:* ${page}\n*Time:* ${
        timestamp?.toDate?.() ?? timestamp
      }\n*Details:* ${detail ?? "N/A"}`,
    };

    try {
      if (!SLACK_WEBHOOK_URL) {
        console.warn("Slack webhook URL not set. Skipping notification.");
        return;
      }

      const response = await fetch(SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slackMessage),
      });

      if (!response.ok) {
        console.error(
          "Failed to send Slack notification:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error sending Slack notification:", error);
    }
  }
);
