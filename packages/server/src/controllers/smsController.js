// src/controllers/smsController.js (SMS 로그/수신자)
import { db } from "../config/firebase.js";

// SMS 로그 생성
export const createSmsLog = async (req, res) => {
  try {
    const { senderId, type, message, status = 'sent', recipients = [] } = req.body;
    if (!senderId || !type || !message || recipients.length === 0) {
      return res.status(400).json({ error: "필수 항목 누락" });
    }
    const logRef = await db.collection("smsLogs").add({ senderId, type, message, status, createdAt: new Date().toISOString() });
    // 하위 수신자 추가
    const batch = db.batch();
    recipients.forEach(({ recipientUid, recipientPhone }) => {
      const ref = logRef.collection("smsRecipients").doc();
      batch.set(ref, { recipientUid, recipientPhone });
    });
    await batch.commit();
    res.status(201).json({ id: logRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SMS 로그 전체/조건별 조회
export const getSmsLogs = async (req, res) => {
  try {
    let query = db.collection("smsLogs");
    const { senderId, type, status } = req.query;
    if (senderId) query = query.where("senderId", "==", senderId);
    if (type) query = query.where("type", "==", type);
    if (status) query = query.where("status", "==", status);
    const snapshot = await query.get();
    const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 특정 SMS 로그의 수신자 조회
export const getSmsRecipients = async (req, res) => {
  try {
    const { logId } = req.params;
    const snapshot = await db.collection("smsLogs").doc(logId).collection("smsRecipients").get();
    const recipients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(recipients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
