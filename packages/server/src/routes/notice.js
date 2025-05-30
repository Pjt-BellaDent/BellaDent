// src/routes/notice.js

import express from 'express';
import { getNotices, saveNotices } from '../controllers/noticeController.js';

const router = express.Router();

router.get('/', getNotices);      // GET /api/notice
router.post('/', saveNotices);    // POST /api/notice

export default router;
