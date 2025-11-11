/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import { logError } from "./logError";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export { logError };
export { notifyOnError } from "./notifyOnError";

admin.initializeApp();

export const logTestError = functions.https.onRequest(async (req, res) => {
  try {
    const ref = admin.firestore().collection("errorLogs");
    await ref.add({
      message: "Test error log from function",
      page: "/error-logs",
      detail: "This is a simulated error stack trace",
      timestamp: admin.firestore.Timestamp.now(),
      level: "error",
    });
    res.status(200).send("Test error log added ✅");
  } catch (error) {
    console.error("Error writing test log:", error);
    res.status(500).json({
      message: "Failed to write test log",
      details: (error as Error).message,
    });
  }
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
