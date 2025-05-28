import express from "express";
import {
  GeminiChat
} from "../controllers/aiChatController.js";

const router = express.Router();

router.post("/ai", GeminiChat);

export default router;
