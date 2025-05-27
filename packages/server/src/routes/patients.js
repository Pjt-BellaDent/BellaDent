import express from "express";
import {
  getAllPatients,
  updatePatient,
  createPatient // ← 요거 추가 필요
} from "../controllers/patientsController.js";

const router = express.Router();
router.get("/", getAllPatients);
router.put("/:id", updatePatient);
router.post("/", createPatient); // ← 여기

export default router;
