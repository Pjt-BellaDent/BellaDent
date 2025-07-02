// src/index.js
import http from "http";
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
import faqsRouter from "./routes/faqs.js";
import appointmentsRouter from "./routes/appointments.js";
import procedureRouter from "./routes/procedure.js";
import staffSchedulesRouter from "./routes/staffSchedules.js";
import statsRouter from "./routes/stats.js";
import waitingRouter from "./routes/waiting.js";
import patientsRouter from "./routes/patients.js";
import hospitalRouter from "./routes/hospital.js";
import activitiesRouter from "./routes/activities.js";
import aiChatRouter from "./routes/aiChat.js";

import noticeRoutes from "./routes/notices.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = initSocketServer(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.DEVELOP_URL, process.env.PRODUCTION_URL],
    credentials: true,
  })
);
app.use(logger("dev"));

app.use("/users", userRouter);
app.use("/consultations", consultationsRouter);
app.use("/reviews", reviewsRouter);
app.use("/sms", smsLogsRouter);
app.use("/faqs", faqsRouter);
app.use("/notices", noticeRoutes);

app.use("/appointments", appointmentsRouter);
app.use("/procedures", procedureRouter);
app.use("/staff-schedules", staffSchedulesRouter);
app.use("/stats", statsRouter);
app.use("/waiting", waitingRouter);
app.use("/patients", patientsRouter);
app.use("/hospital", hospitalRouter);
app.use("/activities", activitiesRouter);
app.use("/ai", aiChatRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

server.listen(port, () => {
  console.log(`BellaDent app + Socket.IO 실행: http://localhost:${port}`);
});
