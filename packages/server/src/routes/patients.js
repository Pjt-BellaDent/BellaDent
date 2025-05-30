// ✅ patients.js 라우터 수정: deletePatient 라우트 추가
import express from "express";
import {
  getAllPatients,
  updatePatient,
  createPatient,
  deletePatient // ✅ 추가
} from "../controllers/patientsController.js";

const router = express.Router();

router.get("/", getAllPatients);
router.put("/:id", updatePatient);
router.post("/", createPatient);
router.delete("/:id", deletePatient); // ✅ 라우터 연결 완료

export default router;
