// src/routes/records.js (진료기록/시술기록 라우트)
import express from 'express';
import {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
} from '../controllers/recordsController.js';

const router = express.Router();

router.post('/', createRecord);        // 진료기록 등록
router.get('/', getRecords);           // 전체/조건별 조회
router.put('/:id', updateRecord);      // 진료기록 수정
router.delete('/:id', deleteRecord);   // 진료기록 삭제

export default router;
