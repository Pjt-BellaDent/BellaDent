import express from 'express';
import { getChatbotSettings, updateChatbotSettings, GeminiChat } from '../controllers/aiChatController.js';

const router = express.Router();

// 챗봇 설정 조회
router.get('/settings', getChatbotSettings);

// 챗봇 설정 업데이트
router.put('/settings', updateChatbotSettings);

// AI 챗봇 응답 요청
router.post('/', GeminiChat);

export default router;
