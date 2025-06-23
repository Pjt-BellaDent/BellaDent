import express from 'express';
import { getHospitalInfo, updateHospitalInfo } from '../controllers/hospitalController.js';

const router = express.Router();

router.get('/info', getHospitalInfo);
router.put('/info', updateHospitalInfo);

export default router; 