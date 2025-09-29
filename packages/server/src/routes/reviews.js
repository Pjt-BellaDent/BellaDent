// src/routes/reviews.js
import express from "express";
import multer from "multer";
import {
  createReview,
  readAllReviews,
  readReviewsByAuthorId,
  readSingleReviewById,
  readDisabledReviewsByAuthorId,
  readPendingReviews,
  updateReview,
  requestReapproval,
  enableReview,
  disabledReview,
  deleteReview,
} from "../controllers/reviewController.js";
import {
  authenticateFirebaseToken,
  patientRoleCheck,
  managerRoleCheck,
  adminRoleCheck,
} from "../middleware/roleCheck.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const auth = authenticateFirebaseToken;

router.post(
  "/",
  auth,
  patientRoleCheck,
  upload.fields([{ name: "reviewImg", maxCount: 10 }]),
  createReview
);

router.get("/", auth, readAllReviews);
router.get("/:id", auth, patientRoleCheck, readReviewsByAuthorId);

router.get("/single/:id", auth, patientRoleCheck, readSingleReviewById);

router.get(
  "/disabled/:id",
  auth,
  patientRoleCheck,
  readDisabledReviewsByAuthorId
);
router.get("/pending/", auth, managerRoleCheck, readPendingReviews);

router.put(
  "/:id",
  auth,
  patientRoleCheck,
  upload.fields([{ name: "reviewImg", maxCount: 10 }]),
  updateReview
);
router.put("/reapproval/:id", auth, patientRoleCheck, requestReapproval);
router.put("/enable/:id", auth, managerRoleCheck, enableReview);
router.put("/disabled/:id", auth, managerRoleCheck, disabledReview);

router.delete("/:id", auth, patientRoleCheck, deleteReview);

export default router;
