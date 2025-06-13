import { db } from "../config/firebase.js";
import { noticeSchema, updateNoticeSchema } from "../models/notice.js";
import { Timestamp } from "firebase-admin/firestore";

// 공지 사항 생성
export const createNotice = async (req, res) => {
  const { value, error } = noticeSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ message: "Validation Error" });
  }

  try {
    const now = Timestamp.now();

    const docRef = db.collection("notices").doc();
    await docRef.set({
      id: docRef.id, // Firestore 문서 ID
      ...value,
      createdAt: now,
      updatedAt: now,
    });

    res.status(201).json({ message: "공지 사항 등록 성공" });
  } catch (err) {
    console.error("공지 사항 등록 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// 공지 사항 조회
export const readAllNotices = async (req, res) => {
  try {
    const noticesDoc = await db.collection("notices").get();
    const noticesData = noticesDoc.docs.map((doc) => doc.data());

    if (noticesDoc.empty) {
      return res.status(404).json({ message: "내용을 찾을 수 없습니다." });
    }

    res
      .status(200)
      .json({ notices: noticesData, message: "전체 공지 사항 조회 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 비활성화 공지 사항 조회
export const readDisabledNoticesById = async (req, res) => {
  try {
    const disabledNoticesData = await db
      .collection("notices")
      .where("isPublic", "==", false) // isPublic이 false인 조건 추가
      .get(); // 조건에 맞는 모든 문서 가져오기

    if (disabledNoticesData.empty) {
      return res.status(404).json({ message: "내용을 찾을 수 없습니다." });
    }

    const disabledNotices = disabledNoticesData.docs.map((doc) => doc.data());

    res.status(200).json({
      notices: disabledNotices, // 배열 형태로 반환
      message: "작성자의 비활성화 공지 사항 조회 성공", // 메시지 수정
    });
  } catch (err) {
    console.error("작성자의 비활성화 공지 사항 조회 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// 공지 사항 수정
export const updateNotice = async (req, res) => {
  const noticeId = req.params.id;
  const { value, error } = updateNoticeSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      message: "Validation Error",
    });
  }

  try {
    const docRef = db.collection("notices").doc(noticeId);
    const noticeDoc = await docRef.get();
    const now = Timestamp.now();

    if (!noticeDoc.exists) {
      return res.status(404).json({ message: "내용을 찾을 수 없습니다." });
    }

    // 4. Firestore 업데이트
    await docRef.update({
      ...value,
      updatedAt: now,
    });

    res.status(200).json({ message: "공지 사항 수정 성공" });
  } catch (err) {
    console.error("공지 사항 수정 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// 공지 사항 활성화
export const enableNotice = async (req, res) => {
  try {
    const noticeId = req.params.id;
    const noticeRef = db.collection("notices").doc(noticeId);
    const noticeDoc = await noticeRef.get();

    if (!noticeDoc.exists) {
      return res.status(404).json({ message: "내용을 찾을 수 없습니다." });
    }

    const now = Timestamp.now();

    await noticeRef.update({
      isPublic: true,
      updatedAt: now,
    });

    res.status(200).json({ message: "공지 사항 활성화 성공" });
  } catch (err) {
    console.error("공지 사항 활성화 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// 공지 사항 비활성화
export const disabledNotice = async (req, res) => {
  try {
    const noticeId = req.params.id;
    const noticeRef = db.collection("notices").doc(noticeId);
    const noticeDoc = await noticeRef.get();

    if (!noticeDoc.exists) {
      return res.status(404).json({ message: "내용을 찾을 수 없습니다." });
    }

    const now = Timestamp.now();

    await noticeRef.update({
      isPublic: false,
      updatedAt: now,
    });

    res.status(200).json({ message: "공지 사항 비활성화 성공" });
  } catch (err) {
    console.error("공지 사항 비활성화 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// 공지 사항 삭제
export const deleteNotice= async (req, res) => {
  try {
    const reviewId = req.params.id;
    const noticeRef = db.collection("notices").doc(reviewId);
    const noticeDoc = await noticeRef.get();

    if (!noticeDoc.exists) {
      return res.status(404).json({ message: "공지 사항를 찾을 수 없습니다." });
    }

    // 2. Firestore 문서 삭제
    await noticeRef.delete();

    res.status(204).json({ message: "공지 사항 삭제 성공" });
  } catch (err) {
    console.error("공지 사항 삭제 에러:", err);
    res.status(500).json({ error: err.message });
  }
};
