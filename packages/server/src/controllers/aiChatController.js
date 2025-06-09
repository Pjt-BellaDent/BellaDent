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
