// src/controllers/userDeleteController.js
import { db, auth } from "../config/firebase.js";

export const deleteUser = async (req, res) => {
  const paramsId = req.params.id;

  try {
    const userDocRef = db.collection("users").doc(paramsId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "수정하려는 사용자를 찾을 수 없습니다." });
    }

    const existingUserData = userDoc.data();
    const userRole = existingUserData.role;

    await auth.deleteUser(paramsId);

    const batch = db.batch();

    const userInfoDelete = db.collection("users").doc(paramsId);
    batch.delete(userInfoDelete);

    if (userRole === "patient") {
      const patientInfoDelete = db
        .collection("users")
        .doc(paramsId)
        .collection("patients")
        .doc(paramsId);
      batch.delete(patientInfoDelete);
    }

    if (["staff", "manager", "admin"].includes(userRole)) {
      const staffInfoDelete = db
        .collection("users")
        .doc(paramsId)
        .collection("staffs")
        .doc(paramsId);
      batch.delete(staffInfoDelete);
    }

    await batch.commit();

    res.status(204).json({ message: "회원 탈퇴 성공" });
  } catch (err) {
    console.error("회원 탈퇴 에러:", err);
    res.status(500).json({ error: err.message });
  }
};
