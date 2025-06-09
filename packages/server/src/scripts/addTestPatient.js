import { db } from "../config/firebase.js";
import bcrypt from "bcrypt";

async function addTestUser() {
  try {
    const email = "testuser@example.com";
    const password = "testpassword";
    const hashed = bcrypt.hashSync(password, 10);

    const userData = {
      email,
      password: hashed,
      role: "admin",  // 원하는 역할로 변경 가능 (patient, staff, manager, admin)
      name: "테스트 사용자",
      birth: "1990-01-01",
      phone: "010-0000-0000",
      gender: "남",
      lastVisit: null,
      createdAt: new Date().toISOString(),
    };

    // 중복 체크
    const existing = await db.collection("users").where("email", "==", email).get();
    if (!existing.empty) {
      console.log("이미 해당 이메일로 등록된 사용자가 있습니다.");
      return;
    }

    const docRef = await db.collection("users").add(userData);
    console.log("테스트 사용자 등록 완료. ID:", docRef.id);
  } catch (err) {
    console.error("사용자 등록 실패:", err);
  }
}

addTestUser();
