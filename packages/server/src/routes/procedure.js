// src/routes/procedure.js
import express from 'express';
import {
  getProcedureStats,
  getProceduresByName,
  addProcedure,
  getTodayProcedures,  // 추가
} from '../controllers/procedureController.js';
import { db } from '../config/firebase.js'; // db 인스턴스 직접 import

const router = express.Router();

router.get('/stats', getProcedureStats);
router.get('/', getProceduresByName);
router.post('/', addProcedure);

// 이름+생년월일로 시술 이력 조회 (RESTful)
router.get('/name/:name/:birth', async (req, res) => {
  const { name, birth } = req.params;
  if (!name || !birth) return res.status(400).json({ error: "이름/생년월일 필요" });
  try {
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
});

router.get('/today', getTodayProcedures);  // 라우트 추가

export default router;
