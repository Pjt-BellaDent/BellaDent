import express from "express";
import { callPatient } from "../controllers/callController.js";
const router = express.Router();

router.post("/", callPatient);

export default router; 