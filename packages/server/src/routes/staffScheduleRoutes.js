import express from 'express';
import {
  createSchedule,
  getSchedulesByMonth,
  updateSchedule,
  deleteSchedule
} from '../controllers/staffScheduleController.js';

const router = express.Router();

router.post('/', createSchedule);
router.get('/', getSchedulesByMonth);
router.patch('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

export default router;
