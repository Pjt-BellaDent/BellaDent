import express from 'express';
import {
  getAppointmentsByDate,
  createAppointment,
  deleteAppointment,
  updateAppointment
} from '../controllers/testController.js';

const router = express.Router();

router.get('/appointments', getAppointmentsByDate);
router.post('/appointments', createAppointment); // sample 제거
router.delete('/appointments/:id', deleteAppointment);
router.patch('/appointments/:id', updateAppointment);

export default router;
