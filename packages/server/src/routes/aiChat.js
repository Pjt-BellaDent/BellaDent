import express from 'express';
import axios from 'axios';
import { db, admin } from '../config/firebase.js';
import { getChatbotSettings, updateChatbotSettings } from './aiChatController.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// 챗봇 설정 조회
router.get('/settings', getChatbotSettings);

// 챗봇 설정 업데이트
router.put('/settings', updateChatbotSettings);

async function generateChatResponse(message, consultationId = 'unknown') {
  if (!message) throw new Error("질문이 없습니다.");

  const functionResponse = await axios.post(
    process.env.FIREBASE_FUNCTION_URL,
    { message },
    { headers: { "Content-Type": "application/json" } }
  );

  const aiReply = functionResponse.data.reply || "응답 없음";

  // Firestore 저장 (consultationId는 선택적 사용)
  if (consultationId && consultationId !== 'unknown') {
    await db.collection("consultations")
      .doc(consultationId)
      .collection("messages")
      .add({
        senderId: "AI_Bot",
        senderType: "staff",
        content: aiReply,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  return aiReply;
}

router.post('/ai', async (req, res) => {
  try {
    const { question, message, consultationId } = req.body;
    const input = question || message;
    const cid = consultationId || 'unknown';

    const answer = await generateChatResponse(input, cid);
    res.json({ answer });
  } catch (err) {
  console.error("🔥 AI 응답 실패:", err.message);
  if (err.response?.data) {
    console.error("📦 응답 본문:", err.response.data);
  }
  if (err.stack) {
    console.error("🧱 스택:", err.stack);
  }

  res.status(500).json({ error: err.message || 'Internal error' });
}
});



export default router;
