// src/routes/users.js
import express from "express";
import {
  signUp,
  CreatePatient,
  CreateStaff,
} from "../controllers/userCreateController.js";
import { deleteUser } from "../controllers/userDeleteController.js";
import {
  signIn,
  getUserById,
  getPatients,
  getPatientById,
  getPatientByName,
  getStaffById,
  getAllStaff,
} from "../controllers/userReadController.js";
import {
  updateUser,
  updatePatient,
  updateStaff,
  enableUser,
  disabledUser,
} from "../controllers/userUpdateController.js";
import {
  authenticateFirebaseToken,
  patientRoleCheck,
  staffRoleCheck,
  managerRoleCheck,
  adminRoleCheck,
} from "../middleware/roleCheck.js";

const router = express.Router();
const auth = authenticateFirebaseToken;

router.post("/signUp", signUp);
router.post("/patient", auth, staffRoleCheck, CreatePatient);
router.post("/staff", auth, managerRoleCheck, CreateStaff);

router.post("/signIn", auth, signIn);

router.get("/staff", getAllStaff);

router.get("/:id", auth, patientRoleCheck, getUserById);
router.get("/patient", auth, staffRoleCheck, getPatients);
router.get("/patient/:id", auth, staffRoleCheck, getPatientById);
router.get("/patient/name/:id", auth, staffRoleCheck, getPatientByName);
router.get("/staff/:id", auth, staffRoleCheck, getStaffById);
router.get('/patients/all', getPatients);

router.put("/:id", auth, patientRoleCheck, updateUser);
router.put("/patient/:id", auth, staffRoleCheck, updatePatient);
router.put("/staff/:id", auth, managerRoleCheck, updateStaff);
router.put("/enable/:id", auth, managerRoleCheck, enableUser);
router.put("/disabled/:id", auth, patientRoleCheck, disabledUser);

router.delete("/:id", auth, adminRoleCheck, deleteUser);

export default router;
