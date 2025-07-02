// src/routes/procedure.js
import express from 'express';
import {
  getProcedureStats,
  getProceduresByName,
  addProcedure,
  getTodayProcedures,
} from '../controllers/procedureController.js';
import { db } from '../config/firebase.js';

const router = express.Router();

router.get('/stats', getProcedureStats);
router.get('/', getProceduresByName);
router.post('/', addProcedure);

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

router.get('/today', getTodayProcedures);

export default router;
