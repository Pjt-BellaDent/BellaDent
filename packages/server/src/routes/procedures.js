import express from "express";
import {
    getProcedureStats,
    getProceduresByName,
    addProcedure
  } from "../controllers/procedureController.js";
  
const router = express.Router();

router.get("/stats", getProcedureStats);
router.get("/", getProceduresByName);
router.post("/", addProcedure);

export default router;
