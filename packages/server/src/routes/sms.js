// src/routes/sms.js (SMS 로그/수신자 라우트)
import express from 'express';
import {
  createSmsLog,
  getSmsLogs,
  getSmsRecipients
} from '../controllers/smsController.js';

const router = express.Router();

router.post('/', createSmsLog);            // SMS 로그 등록
router.get('/', getSmsLogs);               // 전체/조건별 SMS 로그 조회
router.get('/:logId/recipients', getSmsRecipients); // 특정 로그 수신자 조회

export default router;
