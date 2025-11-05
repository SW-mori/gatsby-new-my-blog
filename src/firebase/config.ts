import { initializeApp, FirebaseApp, getApps, getApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY!,
  authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.GATSBY_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.GATSBY_FIREBASE_APP_ID!,
  measurementId: process.env.GATSBY_FIREBASE_MEASUREMENT_ID!,
};

if (!process.env.GATSBY_FIREBASE_API_KEY) {
  throw new Error("Missing Firebase configuration values");
}

const app: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
