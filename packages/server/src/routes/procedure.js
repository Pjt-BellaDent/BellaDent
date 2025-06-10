// src/routes/procedure.js
import express from 'express';
import {
  getProcedureStats,
  getProceduresByName,
  addProcedure,
  getTodayProcedures,  // 추가
} from '../controllers/procedureController.js';

const router = express.Router();

router.get('/stats', getProcedureStats);
router.get('/', getProceduresByName);
router.post('/', addProcedure);

router.get('/today', getTodayProcedures);  // 라우트 추가

export default router;
