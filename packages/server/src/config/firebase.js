import dotenv from "dotenv";
import { readFile } from "fs/promises";
import * as admin from 'firebase-admin';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

dotenv.config();

// 실제 서비스 계정 JSON 객체를 불러옵니다.
const serviceAccount = JSON.parse(
  await readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8")
);

// Firebase Admin 앱이 이미 초기화되었는지 확인합니다.
const app = getApps().length === 0 ?
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`, // Realtime Database 사용 시 필요
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Cloud Storage 사용 시 필요
    projectId: process.env.FIREBASE_PROJECT_ID // 프로젝트 ID 명시
  }) :
  getApp(); // 이미 초기화되었으면 기존 앱 인스턴스 가져오기

// 초기화된 앱 인스턴스로부터 서비스 인스턴스를 가져옵니다.
export const db = getFirestore(app); // Cloud Firestore
export const auth = getAuth(app); // Firebase Authentication
export const bucket = getStorage(app).bucket(); // Cloud Storage 기본 버킷

export { admin, app };
