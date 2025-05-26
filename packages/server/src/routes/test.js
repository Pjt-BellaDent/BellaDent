import express from 'express';
import {
  getAppointmentsByDate,
  insertSampleAppointments,
  deleteAppointment,
  updateAppointment
} from '../controllers/testController.js';

const router = express.Router();

router.get('/appointments', getAppointmentsByDate);
router.post('/appointments/sample', insertSampleAppointments);
router.delete('/appointments/:id', deleteAppointment);
router.patch('/appointments/:id', updateAppointment);

export default router;
