import dotenv from "dotenv";
import { readFile } from "fs/promises";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

dotenv.config();

const serviceAccount = JSON.parse(
  await readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8")
);
initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore();
export const auth = getAuth();
