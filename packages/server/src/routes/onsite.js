import express from 'express';
import { savePatientToFirestore } from '../controllers/onsiteController.js';

const router = express.Router();

router.post('/firestore', savePatientToFirestore);

export default router;
