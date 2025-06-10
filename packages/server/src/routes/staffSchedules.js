// src/routes/staffSchedules.js (직원 스케줄 라우트)
import express from 'express';
import {
  createSchedule,
  getSchedulesByMonth,
  updateSchedule,
  deleteSchedule
} from '../controllers/staffScheduleController.js';

const router = express.Router();

router.post('/', createSchedule);          // 스케줄 등록
router.get('/', getSchedulesByMonth);      // 월별 조회
router.patch('/:id', updateSchedule);      // 스케줄 수정
router.delete('/:id', deleteSchedule);     // 스케줄 삭제

export default router;
