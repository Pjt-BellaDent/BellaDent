// backend/index.js (최신 ERD, 라우트/미들웨어 통합)
import express from "express";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { admin } from "./config/firebase.js";

import userRouter from "./routes/users.js";
import consultationsRouter from "./routes/consultations.js";
import reviewsRouter from "./routes/reviews.js";
import smsLogsRouter from "./routes/smsLogs.js";
import faqsRouter from "./routes/faqs.js";
import appointmentsRouter from "./routes/appointments.js";
import procedureRouter from "./routes/procedure.js";
import staffSchedulesRouter from "./routes/staffSchedules.js";
import statsRouter from './routes/stats.js';
import waitingRouter from './routes/waiting.js';
import patientsRouter from "./routes/patients.js";
import hospitalRouter from './routes/hospital.js';
import activitiesRouter from './routes/activities.js';

import noticeRoutes from './routes/notices.js';
import smsRoutes from './routes/sms.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(logger('dev'));

app.use("/users", userRouter);
app.use("/consultations", consultationsRouter);
app.use("/reviews", reviewsRouter);
app.use("/sms", smsLogsRouter);
app.use("/faqs", faqsRouter);

app.use('/api/sms', smsRoutes);
app.use('/api/notice', noticeRoutes);

// ===== 엔티티별 라우트 등록 (최종본) =====
app.use("/appointments", appointmentsRouter);
app.use("/procedures", procedureRouter);
app.use("/staff-schedules", staffSchedulesRouter);
app.use('/stats', statsRouter);
app.use('/waiting', waitingRouter);
app.use("/patients", patientsRouter);
app.use('/hospital', hospitalRouter);
app.use('/activities', activitiesRouter);

// ===== 404 핸들러 =====
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(port, () => {
  console.log(`BellaDent app listening on port ${port}`);
});
