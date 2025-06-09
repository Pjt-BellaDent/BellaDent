import express from 'express';
import { generateChatResponse } from '../services/aiService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { question } = req.body;
  try {
    const answer = await generateChatResponse(question);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI 응답 실패' });
  }
});

export default router;
