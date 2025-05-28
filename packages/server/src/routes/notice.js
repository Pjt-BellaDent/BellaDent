import express from 'express';
import {
  getNotices,
  addNotice,
  deleteNotice,
  updateNotice
} from '../controllers/noticeController.js';

const router = express.Router();

router.get('/', getNotices);
router.post('/', addNotice);
router.delete('/:id', deleteNotice);
router.put('/:id', updateNotice);

export default router;