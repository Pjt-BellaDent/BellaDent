// src/routes/faqs.js
import express from "express";
import {
  createFaq,
  readAllFaqs,
  readDisabledFaqsById,
  updateFaq,
  enableFaq,
  disabledFaq,
  deleteFaq,
} from "../controllers/faqController.js";
import {
  authenticateFirebaseToken,
  managerRoleCheck,
  adminRoleCheck,
} from "../middleware/roleCheck.js";

const router = express.Router();
const auth = authenticateFirebaseToken;

router.post("/", auth, managerRoleCheck, createFaq);
router.get("/", readAllFaqs);
router.get("/disabled", auth, managerRoleCheck, readDisabledFaqsById);
router.put("/:id", auth, managerRoleCheck, updateFaq);
router.put("/enable/:id", auth, managerRoleCheck, enableFaq);
router.put("/disabled/:id", auth, managerRoleCheck, disabledFaq);
router.delete("/:id", auth, adminRoleCheck, deleteFaq);

export default router;
