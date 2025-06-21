// backend/index.js (최신 ERD, 라우트/미들웨어 통합)
import http from "http";
import express from "express";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import initSocketServer from "./config/socketServer.js"; // 경로 확인: config/socketServer.js

import userRouter from "./routes/users.js";
import consultationsRouter from "./routes/consultations.js";
import reviewsRouter from "./routes/reviews.js";
import smsLogsRouter from "./routes/smsLogs.js";
import noticesRouter from "./routes/notices.js";
import faqsRouter from "./routes/faqs.js";
import appointmentsRouter from "./routes/appointments.js";
import procedureRouter from "./routes/procedure.js";
import staffSchedulesRouter from "./routes/staffSchedules.js";
import recordsRouter from "./routes/records.js";
import postsRouter from "./routes/posts.js";
import messagesRouter from "./routes/messages.js";
import activitiesRouter from "./routes/activities.js";
import statsRouter from "./routes/stats.js";
import waitingRouter from "./routes/waiting.js";
import patientsRouter from "./routes/patients.js";
import callRouter from "./routes/call.js";
import hospitalRouter from "./routes/hospital.js";

import noticeRoutes from "./routes/notices.js"; // 중복 임포트 가능성 있으나, 일단 유지
import smsRoutes from "./routes/sms.js";
import onsiteRoutes from "./routes/onsite.js";
import feedbackRoutes from "./routes/feedback.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// HTTP 서버 생성
const server = http.createServer(app);

// Socket.IO 서버 초기화 및 인스턴스 저장
// initSocketServer 함수가 io 인스턴스를 반환하므로, 그 값을 받아야 합니다.
const io = initSocketServer(server); // <--- 여기가 핵심 변경 사항! io 인스턴스를 받습니다.

// 모든 요청에 io 인스턴스를 req.io로 주입하는 미들웨어
// 모든 라우터 등록 전에 위치해야 합니다.
app.use((req, res, next) => {
  req.io = io; // req 객체에 io 인스턴스 주입
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(logger("dev"));

app.use("/users", userRouter);
app.use("/consultations", consultationsRouter);
app.use("/reviews", reviewsRouter);
app.use("/sms", smsLogsRouter);
app.use("/notices", noticesRouter);
app.use("/faqs", faqsRouter);

app.use("/api/sms", smsRoutes);
app.use("/api/onsite", onsiteRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notice", noticeRoutes);

// ===== 엔티티별 라우트 등록 (최종본) =====
app.use("/appointments", appointmentsRouter);
app.use("/procedures", procedureRouter);
app.use("/staff-schedules", staffSchedulesRouter);
app.use("/records", recordsRouter);
app.use("/posts", postsRouter);
app.use("/messages", messagesRouter);
app.use("/activities", activitiesRouter);
app.use("/stats", statsRouter);
app.use("/waiting", waitingRouter);
app.use("/patients", patientsRouter);
app.use("/api/call", callRouter);
app.use("/hospital", hospitalRouter);

// ===== 404 핸들러 =====
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// 서버 실행
server.listen(port, () => {
  console.log(`BellaDent app + Socket.IO 실행: http://localhost:${port}`);
});
