import { db } from "../config/firebase.js";
import { faqSchema, updateFaqSchema } from "../models/faq.js";
import { Timestamp } from "firebase-admin/firestore";

// FAQ 전체 조회
export const readAllFaqs = async (req, res) => {
  try {
    const snapshot = await db.collection('faqs').orderBy('createdAt', 'desc').get();
    const faqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// FAQ 생성
export const createFaq = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "제목과 내용은 필수입니다." });
    }
    const newFaq = {
      title,
      content,
      isPublic: true,
      createdAt: new Date().toISOString(),
    };
    const docRef = await db.collection('faqs').add(newFaq);
    res.status(201).json({ id: docRef.id, ...newFaq });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// FAQ 수정
export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isPublic } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    
    await db.collection('faqs').doc(id).update(updateData);
    const updatedDoc = await db.collection('faqs').doc(id).get();
    res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// FAQ 삭제
export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('faqs').doc(id).delete();
    res.status(200).json({ message: "FAQ 삭제 완료" });
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
