// src/routes/consultations.js (상담 라우트)
import express from 'express';
import {
  createConsultation,
  getConsultations,
  updateConsultation,
  deleteConsultation
} from '../controllers/consultationsController.js';

const router = express.Router();

router.post('/', createConsultation);         // 상담 등록
router.get('/', getConsultations);            // 전체/조건별 조회
router.put('/:id', updateConsultation);       // 상담 상태/담당자 수정
router.delete('/:id', deleteConsultation);    // 상담 삭제

export default router;
