import express from "express";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from "./routes/users.js";
import appointmentRouter from "./routes/appointments.js";
import procedureRouter from "./routes/procedures.js";
import statRouter from "./routes/stats.js";
import waitingRouter from "./routes/waiting.js";
import testRouter from "./routes/test.js";
import staffScheduleRoutes from './routes/staffScheduleRoutes.js';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)
app.use(logger('dev'))

app.use("/users", userRouter);
app.use("/appointments", appointmentRouter);
app.use("/procedures", procedureRouter);
app.use("/stats", statRouter);
app.use("/waiting", waitingRouter);
app.use("/test", testRouter);
app.use('/staff-schedules', staffScheduleRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

