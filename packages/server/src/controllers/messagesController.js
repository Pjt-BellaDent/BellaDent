// src/controllers/messagesController.js (상담 메시지/채팅)
import { db } from "../config/firebase.js";

// 메시지 전송
export const sendMessage = async (req, res) => {
  try {
    const { senderId, senderType, content, sentAt = new Date().toISOString() } = req.body;
    if (!senderId || !senderType || !content) {
      return res.status(400).json({ error: "필수 항목 누락" });
    }
    const msg = { senderId, senderType, content, sentAt };
    const doc = await db.collection("messages").add(msg);
    res.status(201).json({ id: doc.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 전체/조건 메시지 조회 (상담ID/송신자 등)
export const getMessages = async (req, res) => {
  try {
    let query = db.collection("messages");
    const { senderId, senderType, consultationId } = req.query;
    if (senderId) query = query.where("senderId", "==", senderId);
    if (senderType) query = query.where("senderType", "==", senderType);
    if (consultationId) query = query.where("consultationId", "==", consultationId);
    const snapshot = await query.get();
    const result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 메시지 삭제
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("messages").doc(id).delete();
    res.json({ message: "메시지 삭제 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
