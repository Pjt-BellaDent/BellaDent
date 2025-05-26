import express from "express";
import { getWaitingStatus } from "../controllers/waitingController.js";

const router = express.Router();

router.get("/status", getWaitingStatus);

export default router;
