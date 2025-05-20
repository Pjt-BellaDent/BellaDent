import express from "express";
import {
  // getUserById,
  signUp,
  // signIn,
  // updateUser,
  // deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// router.get("/:id", getUserById);
router.post("/signUp", signUp);
// router.post("/signIn", signIn);
// router.put("/:id", updateUser);
// router.delete("/:id", deleteUser);

export default router;
