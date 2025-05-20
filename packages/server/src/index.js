import express from "express";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { initializeApp, cert } from "firebase-admin/app";
import { readFile } from "fs/promises";
import userRouter from "./routes/users.js";

dotenv.config();

const app = express();
const port = 3000;

// JSON 접속키 파일 읽기
const serviceAccount = JSON.parse(
  await readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8")
);

// Firebase Admin SDK 초기화
initializeApp({
  credential: cert(serviceAccount),
});

app.use(express.json());
app.use(cors());
app.use(logger('dev'))

app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
