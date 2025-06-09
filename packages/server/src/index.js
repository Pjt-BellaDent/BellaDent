// backend/index.js (최신 ERD, 라우트/미들웨어 통합)
import express from "express";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
// ===== 라우트 =====
import usersRouter from "./routes/users.js";
import appointmentsRouter from "./routes/appointments.js";
import procedureRouter from "./routes/procedure.js";
import staffSchedulesRouter from "./routes/staffSchedules.js";
import recordsRouter from "./routes/records.js";
import postsRouter from "./routes/posts.js";
import smsRouter from "./routes/sms.js";
import consultationsRouter from "./routes/consultations.js";
import messagesRouter from "./routes/messages.js";
import activitiesRouter from './routes/activities.js';
import statsRouter from './routes/stats.js';
import waitingRouter from './routes/waiting.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(logger('dev'));


// ===== 엔티티별 라우트 등록 (최종본) =====
app.use("/users", usersRouter);
app.use("/appointments", appointmentsRouter);
app.use("/procedures", procedureRouter);
app.use("/staff-schedules", staffSchedulesRouter);
app.use("/records", recordsRouter);
app.use("/posts", postsRouter);
app.use("/sms", smsRouter);
app.use("/consultations", consultationsRouter);
app.use("/messages", messagesRouter);
app.use('/activities', activitiesRouter);
app.use('/stats', statsRouter);
app.use('/waiting', waitingRouter);

// ===== 404 핸들러 =====
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(port, () => {
  console.log(`BellaDent app listening on port ${port}`);
});
