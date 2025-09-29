// src/controllers/procedureController.js
import { db } from "../config/firebase.js";

export const getProcedureStats = async (req, res) => {
  try {
    const snapshot = await db.collection("procedures").get();
    const counts = {};
    snapshot.docs.forEach((doc) => {
      const { type } = doc.data();
      if (type) counts[type] = (counts[type] || 0) + 1;
    });
    const labels = Object.keys(counts);
    const data = Object.values(counts);
    res.json({ labels, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProceduresByName = async (req, res) => {
  try {
    const { name, birth } = req.query;
    if (!name || !birth)
      return res.status(400).json({ error: "이름/생년월일 필요" });
    const snapshot = await db
      .collection("procedures")
      .where("name", "==", name)
      .where("birth", "==", birth)
      .get();
    const result = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addProcedure = async (req, res) => {
  try {
    const data = req.body;
    if (
      !data.name ||
      !data.birth ||
      !data.title ||
      !data.date ||
      !data.doctor ||
      !data.department ||
      !data.time
    ) {
      return res.status(400).json({ error: "필수 항목 누락" });
    }
    const conflict = await db
      .collection("appointments")
      .where("date", "==", data.date)
      .where("department", "==", data.department)
      .where("startTime", "==", data.time)
      .get();
    if (!conflict.empty) {
      return res.status(409).json({ error: "이미 해당 시간 예약 있음" });
    }
    data.createdAt = new Date().toISOString();
    await db.collection("procedures").add(data);
    res.status(201).json({ message: "시술 이력 추가됨" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getTodayProcedures = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const snapshot = await db
      .collection("procedures")
      .where("date", "==", today)
      .get();
    const procedures = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(procedures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
