import express from "express";
import { insertSampleAppointments } from "../controllers/testController.js";

const router = express.Router();

router.post("/appointments/sample", insertSampleAppointments);

export default router;
