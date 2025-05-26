import express from "express";
import { getDashboardChart } from "../controllers/statController.js";

const router = express.Router();

router.get("/chart", getDashboardChart);

export default router;
