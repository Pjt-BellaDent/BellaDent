import axios from "axios";
import dotenv from "dotenv";
import { db, admin } from "../config/firebase.js";
dotenv.config();

export const GeminiChat = async (req, res) => {
  try {
    const question = req.body.message;
    const { message, consultationId } = req.body;
if (!message || !consultationId) {
  return res.status(400).json({ error: "'message' 또는 'consultationId' 누락" });
}

    if (!question) {
      return res.status(400).json({ error: "'message' not found." });
    }

    const functionResponse = await axios.post(
      process.env.FIREBASE_FUNCTION_URL,
      { message: question },
      { headers: { "Content-Type": "application/json" } }
    );

    const aiReply = functionResponse.data.reply || "응답 없음";

    // 🔥 Firestore에 저장
    await db.collection("consultations")
      .doc(consultationId)
      .collection("messages")
      .add({
        senderId: "AI_Bot",
        senderType: "staff",
        content: aiReply,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    res.status(200).json({ answer: aiReply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal error" });
  }
};

const settingsDocRef = db.collection('hospital').doc('chatbot_settings');

/**
 * 챗봇 설정 정보 조회
 */
export const getChatbotSettings = async (req, res) => {
  try {
    const doc = await settingsDocRef.get();
    if (!doc.exists) {
      // 문서가 없으면 기본값 반환
      return res.status(200).json({
        persona: '친절한 치과 상담원',
        guidelines: [
          '병원 정보, 예약 절차, 진료 서비스에 대해 안내합니다.',
          '의료적 진단이나 처방은 제공하지 않습니다.',
          '민감한 개인정보는 수집하지 않습니다.'
        ],
        faqs: []
      });
    }
    res.status(200).json(doc.data());
  } catch (error) {
    console.error("챗봇 설정 조회 실패:", error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

/**
 * 챗봇 설정 정보 업데이트
 */
export const updateChatbotSettings = async (req, res) => {
  try {
    const settings = req.body;
    // TODO: Joi를 사용한 입력값 검증 추가
    await settingsDocRef.set(settings, { merge: true });
    res.status(200).json({ message: '챗봇 설정이 성공적으로 업데이트되었습니다.' });
  } catch (error) {
    console.error("챗봇 설정 업데이트 실패:", error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};
