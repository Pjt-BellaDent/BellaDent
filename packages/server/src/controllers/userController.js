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

export const signIn = async (req, res) => {
  const db = getFirestore();

  try {
    const user = await db
      .collection("users")
      .where("email", "==", req.body.email)
      .get();
    const userData = user.docs[0].data();

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const isMatch = bcrypt.compareSync(
      req.body.password,
      userData.password
    );

    if (!isMatch) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    const tokenData = {
      name: userData.name,
      email: userData.email,
    }

    res.status(201).json({ message: "로그인 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
