import { userSchema } from "../models/user.js";
import { updateUserSchema } from "../models/updateUser.js";
import { db } from "../config/firebase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const existingUser = await db
    .collection("users")
    .where("email", "==", req.body.email)
    .get();

  if (!existingUser.empty) {
    return res.status(404).json({ message: "이미 사용중인 이메일입니다." });
  }

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
  try {
    const user = await db
      .collection("users")
      .where("email", "==", req.body.email)
      .get();

    if (user.empty || user.docs.length === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const userData = user.docs[0].data();
    const isMatch = bcrypt.compareSync(req.body.password, userData.password);

    if (!isMatch) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    const userInfo = {
      id: userData.id,
      name: userData.name,
      role: userData.role,
    };

    const token = jwt.sign(userInfo, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      maxAge: 60 * 60 * 1000,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({ message: "로그인 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await db
      .collection("users")
      .where("id", "==", req.params.id)
      .get();

    if (user.empty || user.docs.length === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    const userData = user.docs[0].data();
    const { password, role, ...userInfo } = userData;
    res.status(201).json({ userInfo, message: "회원정보 조회 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  console.log("updateUser", req.body);
  
  const { value, error } = updateUserSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  try {
    const docRef = db.collection("users").doc(value.id);
    await docRef.update(value);
    res.status(201).json({ message: "회원 정보 수정 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await db
      .collection("users")
      .doc(req.params.id)
      .delete();

    res.status(201).json({ message: "회원탈퇴 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};