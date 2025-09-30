// src/routes/smsLogs.js
import express from "express";
import {
  GetSendNumber,
  SendMessage,
} from "../controllers/smsLogsController.js";
import {
  authenticateFirebaseToken,
  staffRoleCheck,
} from "../middleware/roleCheck.js";

const router = express.Router();

router.get("/number", authenticateFirebaseToken, staffRoleCheck, GetSendNumber);
router.post("/send", authenticateFirebaseToken, staffRoleCheck, SendMessage);

export default router;
