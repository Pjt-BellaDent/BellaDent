import express from "express";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from "./routes/users.js";
import consultationsRouter from "./routes/consultations.js";
import reviewsRouter from "./routes/reviews.js";
import smsLogsRouter from "./routes/smsLogs.js";

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
app.use("/consultations", consultationsRouter);
app.use("/reviews", reviewsRouter);
app.use("/sms", smsLogsRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
