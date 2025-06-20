// backend/index.js (최신 ERD, 라우트/미들웨어 통합)
import http from 'http';
import express from "express";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import initSocketServer from "./config/socketServer.js";

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

import noticeRoutes from "./routes/notices.js";
import smsRoutes from "./routes/sms.js";
import onsiteRoutes from "./routes/onsite.js";
import feedbackRoutes from "./routes/feedback.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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

// http server 생성
const server = http.createServer(app);

// 소켓 서버 초기화
initSocketServer(server);

// 서버 실행
server.listen(port, () => {
  console.log(`BellaDent app + Socket.IO 실행: http://localhost:${port}`);
});
