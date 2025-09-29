// src/routes/aiChat.js
import express from 'express';
import { getChatbotSettings, updateChatbotSettings, GeminiChat } from '../controllers/aiChatController.js';

const router = express.Router();

router.get('/settings', getChatbotSettings);

router.put('/settings', updateChatbotSettings);

router.post('/', GeminiChat);

export default router;
