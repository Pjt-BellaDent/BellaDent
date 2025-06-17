import { db } from "../config/firebase.js";
import { faqSchema, updateFaqSchema } from "../models/faq.js";
import { Timestamp } from "firebase-admin/firestore";

// F&Q 생성
export const createFaq = async (req, res) => {
  const { value, error } = faqSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ message: "Validation Error" });
  }

  try {
    const now = Timestamp.now();

    const docRef = db.collection("faqs").doc();
    await docRef.set({
      id: docRef.id, // Firestore 문서 ID
      ...value,
      createdAt: now,
      updatedAt: now,
    });

    res.status(201).json({ message: "F&Q 등록 성공" });
  } catch (err) {
    console.error("F&Q 등록 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// F&Q 조회
export const readAllFaqs = async (req, res) => {
  try {
    const faqsDoc = await db.collection("faqs").get();
    const faqsData = faqsDoc.docs.map((doc) => doc.data());

    if (faqsDoc.empty) {
      return res.status(404).json({ message: "내용을 찾을 수 없습니다." });
    }

    res
      .status(200)
      .json({ faqs: faqsData, message: "전체 F&Q 조회 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 비활성화 F&Q 조회
export const readDisabledFaqsById = async (req, res) => {
  try {
    const disabledFaqsData = await db
      .collection("faqs")
      .where("isPublic", "==", false) // isPublic이 false인 조건 추가
      .get(); // 조건에 맞는 모든 문서 가져오기

    if (disabledFaqsData.empty) {
      return res.status(404).json({ message: "내용을 찾을 수 없습니다." });
    }

    const disabledFaqs = disabledFaqsData.docs.map((doc) => doc.data());

    res.status(200).json({
      faqs: disabledFaqs, // 배열 형태로 반환
      message: "작성자의 비활성화 F&Q 조회 성공", // 메시지 수정
    });
  } catch (err) {
    console.error("작성자의 비활성화 F&Q 조회 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// F&Q 수정
export const updateFaq = async (req, res) => {
  const faqId = req.params.id;
  const { value, error } = updateFaqSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      message: "Validation Error",
    });
  }

  try {
    const docRef = db.collection("faqs").doc(faqId);
    const faqDoc = await docRef.get();
    const now = Timestamp.now();

    if (!faqDoc.exists) {
      return res.status(404).json({ message: "내용을 찾을 수 없습니다." });
    }

    // 4. Firestore 업데이트
    await docRef.update({
      ...value,
      updatedAt: now,
    });

    res.status(200).json({ message: "F&Q 수정 성공" });
  } catch (err) {
    console.error("&Q 수정 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// F&Q 활성화
export const enableFaq = async (req, res) => {
  try {
    const faqId = req.params.id;
    const faqRef = db.collection("faqs").doc(faqId);
    const faqDoc = await faqRef.get();

    if (!faqDoc.exists) {
      return res.status(404).json({ message: "내용을 찾을 수 없습니다." });
    }

    const now = Timestamp.now();

    await faqRef.update({
      isPublic: true,
      updatedAt: now,
    });

    res.status(200).json({ message: "F&Q 활성화 성공" });
  } catch (err) {
    console.error("F&Q 활성화 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// F&Q 비활성화
export const disabledFaq = async (req, res) => {
  try {
    const faqId = req.params.id;
    const faqRef = db.collection("faqs").doc(faqId);
    const faqDoc = await faqRef.get();

    if (!faqDoc.exists) {
      return res.status(404).json({ message: "내용을 찾을 수 없습니다." });
    }

    const now = Timestamp.now();

    await faqRef.update({
      isPublic: false,
      updatedAt: now,
    });

    res.status(200).json({ message: "F&Q 비활성화 성공" });
  } catch (err) {
    console.error("F&Q 비활성화 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// F&Q 삭제
export const deleteFaq= async (req, res) => {
  try {
    const reviewId = req.params.id;
    const faqRef = db.collection("faqs").doc(reviewId);
    const faqDoc = await faqRef.get();

    if (!faqDoc.exists) {
      return res.status(404).json({ message: "F&Q를 찾을 수 없습니다." });
    }

    // 2. Firestore 문서 삭제
    await faqRef.delete();

    res.status(204).json({ message: "F&Q 삭제 성공" });
  } catch (err) {
    console.error("F&Q 삭제 에러:", err);
    res.status(500).json({ error: err.message });
  }
};
