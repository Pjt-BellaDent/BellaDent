// src/controllers/usersController.js (회원+환자+직원 통합, 병합 최종본)
import { db } from "../config/firebase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ===== [공통 회원가입] =====
export const signUp = async (req, res) => {
  try {
    const { email, password, role = "patient" } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "이메일/비밀번호 필수" });
    }
    // 이메일 중복 체크
    const existing = await db.collection("users").where("email", "==", email).get();
    if (!existing.empty) {
      return res.status(409).json({ message: "이미 사용중인 이메일" });
    }
    const hashed = bcrypt.hashSync(password, 10);
    const userData = { ...req.body, password: hashed, role };
    const doc = await db.collection("users").add(userData);
    res.status(201).json({ id: doc.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===== [로그인] =====
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const snap = await db.collection("users").where("email", "==", email).get();
    if (snap.empty) return res.status(404).json({ message: "사용자 없음" });
    const user = snap.docs[0].data();
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "비밀번호 불일치" });
    }
    const payload = { id: snap.docs[0].id, email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secretkey");
    res.json({ token, user: payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===== [단일 회원 조회] =====
export const getUserById = async (req, res) => {
  try {
    const doc = await db.collection("users").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: "미존재" });
    const { password, ...userInfo } = doc.data();
    res.json(userInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===== [회원 정보 수정] =====
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...rest } = req.body;
    let updateData = { ...rest };
    if (password) updateData.password = bcrypt.hashSync(password, 10);
    await db.collection("users").doc(id).update(updateData);
    res.json({ message: "회원 정보 수정 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===== [회원 삭제] =====
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("users").doc(id).delete();
    res.json({ message: "회원 삭제 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===== [환자 목록(환자만)] =====
export const getAllPatients = async (req, res) => {
  try {
    const snapshot = await db.collection("users").where("role", "==", "patient").get();
    const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===== [환자 등록 (이름+생년월일 중복방지)] =====
export const createPatient = async (req, res) => {
  try {
    const data = req.body;
    if (Array.isArray(data)) {
      // 배열로 여러 환자 등록 처리
      const results = [];
      for (const patient of data) {
        const { name, birth } = patient;
        if (!name || !birth) {
          return res.status(400).json({ error: "이름과 생년월일이 필요합니다." });
        }
        const snapshot = await db.collection("users")
          .where("name", "==", name)
          .where("birth", "==", birth)
          .where("role", "==", "patient")
          .get();
        if (!snapshot.empty) {
          return res.status(409).json({ error: `이미 동일한 이름/생년월일 환자 존재: ${name}` });
        }
        const doc = await db.collection("users").add({ ...patient, role: "patient" });
        results.push({ id: doc.id, name });
      }
      return res.status(201).json({ message: "환자들 등록 완료", results });
    } else {
      // 기존 단일 객체 처리
      const { name, birth } = data;
      if (!name || !birth) {
        return res.status(400).json({ error: "이름과 생년월일이 필요합니다." });
      }
      const snapshot = await db.collection("users")
        .where("name", "==", name)
        .where("birth", "==", birth)
        .where("role", "==", "patient")
        .get();
      if (!snapshot.empty) {
        return res.status(409).json({ error: "이미 동일한 이름/생년월일 환자 존재" });
      }
      const doc = await db.collection("users").add({ ...data, role: "patient" });
      return res.status(201).json({ id: doc.id });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===== [환자 정보 수정] =====
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("users").doc(id).update(req.body);
    res.status(200).json({ message: "환자 정보 수정 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===== [환자 삭제] =====
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("users").doc(id).delete();
    res.status(200).json({ message: "환자 삭제 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getUserIdByNameBirth = async (req, res) => {
  const { name, birth } = req.query;
  if (!name || !birth) {
    return res.status(400).json({ error: "이름과 생년월일이 필요합니다." });
  }
  try {
    const snapshot = await db.collection('users')
      .where('name', '==', name)
      .where('birth', '==', birth)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.json({ userId: "" });
    }

    const userId = snapshot.docs[0].id;
    res.json({ userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};