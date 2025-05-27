import { db } from "../config/firebase.js";

export const getProcedureStats = async (req, res) => {
  try {
    const snapshot = await db.collection("procedures").get();
    const counts = {};

    snapshot.docs.forEach(doc => {
      const { type } = doc.data();
      if (type) {
        counts[type] = (counts[type] || 0) + 1;
      }
    });

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    res.json({ labels, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 시술 이력 조회
export const getProceduresByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: "이름이 필요합니다." });

    const snapshot = await db
      .collection("procedures")
      .where("name", "==", name)
      .get();


    const result = snapshot.docs.map(doc => doc.data());
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 시술 이력 추가
export const addProcedure = async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.title || !data.date || !data.doctor) {
      return res.status(400).json({ error: "필수 항목이 누락되었습니다." });
    }

    await db.collection("procedures").add(data);
    res.status(201).json({ message: "시술 이력이 추가되었습니다." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
