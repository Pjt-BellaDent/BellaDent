import express from "express";
import {
  GetSendNumber,
  SendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/number", GetSendNumber);
router.post("/send", SendMessage);

export default router;
