import dotenv from "dotenv";
import { readFile } from "fs/promises";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from "firebase-admin/auth";

dotenv.config();

const serviceAccount = JSON.parse(
  await readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8")
);

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

export const db = getFirestore();
export const bucket = getStorage().bucket();
export const auth = getAuth();
