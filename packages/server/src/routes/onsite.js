import express from 'express';
import {
  registerPatient,
  getOnsitePatients,
  updateOnsitePatient,
  deleteOnsitePatient
} from '../controllers/onsiteController.js';

const router = express.Router();

router.post('/', registerPatient);              // 현장 접수 등록
router.get('/', getOnsitePatients);             // 전체 접수 조회
router.put('/:id', updateOnsitePatient);        // 접수 정보 수정
router.delete('/:id', deleteOnsitePatient);     // 접수 삭제

export default router;