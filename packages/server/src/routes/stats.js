// src/routes/stats.js
import express from "express";
import { getChartStats } from "../controllers/statsController.js";

const router = express.Router();

router.get("/chart", getChartStats);

export default router;
