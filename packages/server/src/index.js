import express from "express";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from "./routes/users.js";
import noticeRoutes from './routes/notice.js';
import smsRoutes from './routes/sms.js';
import onsiteRoutes from './routes/onsite.js';
import feedbackRoutes from './routes/feedback.js';
import aiChatRoutes from './routes/aiChat.js';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(logger('dev'));

app.use("/users", userRouter);
app.use('/api/notice', noticeRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/onsite', onsiteRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/aiChat', aiChatRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
