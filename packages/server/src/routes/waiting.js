// src/routes/waiting.js
import express from "express";
import {
  getWaitingStatus,
  addWaitingPatient,
  updateWaitingStatus,
  deleteWaitingPatient
} from "../controllers/waitingController.js";

const router = express.Router();

router.get('/status', getWaitingStatus);
router.post('/', addWaitingPatient);
router.put('/:id', updateWaitingStatus);
router.delete('/:id', deleteWaitingPatient);

export default router;
