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

// 시술 이력 조회 (이름+생년월일로 확장)
export const getProceduresByName = async (req, res) => {
  try {
    const { name, birth } = req.query;
    if (!name || !birth) return res.status(400).json({ error: "이름과 생년월일이 필요합니다." });

    const snapshot = await db
      .collection("procedures")
      .where("name", "==", name)
      .where("birth", "==", birth)
      .get();

    const result = snapshot.docs.map(doc => doc.data());
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 시술 이력 추가 시에도 name+birth 저장
export const addProcedure = async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.birth || !data.title || !data.date || !data.doctor || !data.department || !data.time) {
      return res.status(400).json({ error: "필수 항목이 누락되었습니다." });
    }
    // 예약 중복 체크 (필요 시)
    const conflict = await db.collection("appointments")
      .where("reservationDate", "==", data.date)
      .where("department", "==", data.department)
      .where("time", "==", data.time)
      .get();
    if (!conflict.empty) {
      return res.status(409).json({ error: "이미 해당 시간에 예약이 존재합니다." });
    }
    // ⭐ 등록 시각 자동 추가!
    data.createdAt = new Date().toISOString();

    await db.collection("procedures").add(data);
    res.status(201).json({ message: "시술 이력이 추가되었습니다." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};