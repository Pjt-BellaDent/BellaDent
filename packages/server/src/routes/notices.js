// src/routes/notices.js
import express from "express";
import {
  createNotice,
  readAllNotices,
  readDisabledNoticesById,
  updateNotice,
  enableNotice,
  disabledNotice,
  deleteNotice,
} from "../controllers/noticeController.js";
import {
  authenticateFirebaseToken,
  managerRoleCheck,
  adminRoleCheck,
} from "../middleware/roleCheck.js";

const router = express.Router();
const auth = authenticateFirebaseToken;

router.post("/", auth, managerRoleCheck, createNotice);
router.get("/", readAllNotices);
router.get("/disabled", auth, managerRoleCheck, readDisabledNoticesById);
router.put("/:id", auth, managerRoleCheck, updateNotice);
router.put("/enable/:id", auth, managerRoleCheck, enableNotice);
router.put("/disabled/:id", auth, managerRoleCheck, disabledNotice);
router.delete("/:id", auth, adminRoleCheck, deleteNotice);

export default router;
