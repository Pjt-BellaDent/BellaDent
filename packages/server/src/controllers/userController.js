import { userSchema } from "../models/user.js";
import { getFirestore } from "firebase-admin/firestore";
import bcrypt from "bcrypt";

export const signUp = async (req, res) => {
  const db = getFirestore();

  const { value, error } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  try {
    console.log(req.body);
    const docRef = db.collection("users").doc(value.id);
    const hashedPassword = bcrypt.hashSync(value.password, 10);
    await docRef.set({
      ...value,
      password: hashedPassword,
    });
    res.status(201).json({ message: "회원 가입 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
