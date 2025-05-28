import express from "express";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from "./routes/users.js";
import noticeRouter from './routes/notice.js';

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
app.use("/api/notices", noticeRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
