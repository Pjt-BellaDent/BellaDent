import express from "express";
import { getProcedureStats } from "../controllers/procedureController.js";

const router = express.Router();

router.get("/stats", getProcedureStats);

export default router;
