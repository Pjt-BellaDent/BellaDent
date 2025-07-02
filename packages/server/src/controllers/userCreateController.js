// src/controllers/userCreateController.js
import {
  signUpSchema,
  createPatientSchema,
  createStaffSchema,
} from "../models/user.js";
import { db, auth } from "../config/firebase.js";
import { Timestamp } from "firebase-admin/firestore";

export const signUp = async (req, res) => {
  const { value, error } = signUpSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("입력값 유효성 검사 실패:", error.details);
    return res.status(400).json({ message: "입력값 유효성 검사 실패" });
  }

  const { email, password, name, phone } = value;
  const defaultRole = "patient";
  const isActive = true;

  try {
    const userRecord = await auth.createUser({
      email,
      password,
    });

    const userId = userRecord.uid;

    await auth.setCustomUserClaims(userId, {
      role: defaultRole,
      isActive: isActive,
    });
    console.log(`Custom claim role:${defaultRole} set for user ${userId}`);

    const batch = db.batch();
    const now = Timestamp.now();

    const userDocRef = db.collection("users").doc(userId);
    const commonUserData = {
      id: userId,
      email: userRecord.email,
      role: defaultRole,
      name: name,
      phone: phone,
      isActive: isActive,
      createdAt: now,
      updatedAt: now,
    };
    batch.set(userDocRef, commonUserData);

    await batch.commit();

    res.status(201).json({ message: "사용자 개정 생성 성공" });
  } catch (err) {
    console.error("회원 가입 에러:", err);
    if (err.code === "auth/email-already-exists") {
      return res.status(400).json({ message: "이미 등록된 이메일입니다." });
    }
    res.status(500).json({ error: err.message });
  }
};

export const CreatePatient = async (req, res) => {
  const { value, error } = createPatientSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("입력값 유효성 검사 실패:", error.details);
    return res.status(400).json({ message: "입력값 유효성 검사 실패" });
  }

  const { email, password, name, phone, address, gender, birth, patientInfo } =
    value;
  const defaultRole = "patient";
  const isActive = true;

  try {
    const userRecord = await auth.createUser({
      email,
      password,
    });

    const userId = userRecord.uid;

    await auth.setCustomUserClaims(userId, {
      role: defaultRole,
      isActive: isActive,
    });
    console.log(`Custom claim role:${defaultRole} set for user ${userId}`);

    const batch = db.batch();
    const now = Timestamp.now();

    const userDocRef = db.collection("users").doc(userId);

    const commonUserData = {
      id: userId,
      email: userRecord.email,
      role: defaultRole,
      name: name,
      phone: phone,
      address: address || null,
      gender: gender || null,
      birth: birth || null,
      isActive: isActive,
      createdAt: now,
      updatedAt: now,
    };
    batch.set(userDocRef, commonUserData);

    if (defaultRole === "patient" && patientInfo) {
      const patientDocRef = userDocRef.collection("patients").doc(userId);

      const patientData = {
        id: userId,
        ...patientInfo,
      };
      batch.set(patientDocRef, patientData);
    }

    await batch.commit();

    res.status(201).json({ message: `${defaultRole} 환자 계정 생성 성공` });
  } catch (err) {
    console.error("환자 계정 생성 에러:", err);
    if (err.code === "auth/email-already-exists") {
      return res.status(400).json({ message: "이미 등록된 이메일입니다." });
    }
    res.status(500).json({ error: err.message });
  }
};

export const CreateStaff = async (req, res) => {
  const { value, error } = createStaffSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.error("입력값 유효성 검사 실패:", error.details);
    return res.status(400).json({ message: "입력값 유효성 검사 실패" });
  }

  const {
    email,
    password,
    role,
    name,
    phone,
    address,
    gender,
    birth,
    staffInfo,
  } = value;
  const isActive = true;

  try {
    const userRecord = await auth.createUser({
      email,
      password,
    });

    const userId = userRecord.uid;

    await auth.setCustomUserClaims(userId, { role: role, isActive: isActive });
    console.log(`Custom claim role:${role} set for user ${userId}`);

    const batch = db.batch();
    const now = Timestamp.now();

    const userDocRef = db.collection("users").doc(userId);

    const commonUserData = {
      id: userId,
      email: userRecord.email,
      role: role,
      name: name,
      phone: phone,
      address: address || null,
      gender: gender || null,
      birth: birth || null,
      isActive: isActive,
      createdAt: now,
      updatedAt: now,
    };
    batch.set(userDocRef, commonUserData);

    if (["staff", "manager", "admin"].includes(role) && staffInfo) {
      const staffDocRef = userDocRef.collection("staffs").doc(userId);

      const staffData = {
        id: userId,
        ...staffInfo,
      };
      batch.set(staffDocRef, staffData);
    }

    await batch.commit();

    res.status(201).json({ message: `${role} 직원 계정 생성 성공` });
  } catch (err) {
    console.error("직원 계정 생성 에러:", err);
    if (err.code === "auth/email-already-exists") {
      return res.status(400).json({ message: "이미 등록된 이메일입니다." });
    }
    res.status(500).json({ error: err.message });
  }
};
