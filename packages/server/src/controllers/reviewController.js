import { db, bucket } from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";
import { reviewSchema, updateReviewSchema } from "../models/review.js";
import { Timestamp } from "firebase-admin/firestore";

// 후기 등록
export const createReview = async (req, res) => {
  const files = req.files || {};
  const { value, error } = reviewSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ message: "Validation Error" });
  }

  try {
    const imageFiles = files.reviewImg || [];
    const imageUrls = [];
    const now = Timestamp.now();

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const fileName = `image-${now}-${file.originalname}-${uuidv4()}`;
      const uploadRef = bucket.file(fileName);

      await uploadRef.save(file.buffer, {
        metadata: { contentType: file.mimetype },
        public: true,
      });

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      imageUrls.push(publicUrl);
    }

    const docRef = db.collection("reviews").doc();
    await docRef.set({
      id: docRef.id, // Firestore 문서 ID
      ...value,
      imageUrls,
      createdAt: now,
      updatedAt: now,
    });

    res.status(201).json({ message: "치료 후기 등록 성공" });
  } catch (err) {
    console.error("치료 후기 등록 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// 전체 후기 조회
export const readAllReviews = async (req, res) => {
  try {
    const reviewsDoc = await db.collection("reviews").get();
    const reviewsData = reviewsDoc.docs.map((doc) => doc.data());

    if (!reviewsDoc.exists) {
      return res.status(404).json({ message: "내용을 찾을 수 없습니다." });
    }

    res
      .status(200)
      .json({ reviews: reviewsData, message: "전체 치료 후기 조회 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 후기 목록 조회 (id)
export const readReviewById = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const reviewsDoc = await db.collection("reviews").doc(reviewId).get();
    const reviewsData = reviewsDoc.docs.map((doc) => doc.data());

    if (!reviewsDoc.exists) {
      return res.status(404).json({ message: "내용을 찾을 수 없습니다." });
    }

    res
      .status(200)
      .json({ reviews: reviewsData, message: "치료 후기 조회 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 비활성화 후기 목록 조회 (id)
export const readDisabledReviewsByAuthorId = async (req, res) => {
  const authorId = req.params.id;

  try {
    // reviews 컬렉션에서 authorId가 req.params.id이고, isPublic이 false인 문서들을 조회
    const disabledReviewsData = await db
      .collection("reviews")
      .where("authorId", "==", authorId) // 작성자 ID 조건 추가
      .where("isPublic", "==", false) // isPublic이 false인 조건 추가
      .get(); // 조건에 맞는 모든 문서 가져오기

    if (!reviewDoc.exists) {
      return res.status(404).json({ message: "내용을 찾을 수 없습니다." });
    }

    const disabledReviews = disabledReviewsData.docs.map((doc) => doc.data());

    // 결과가 하나일 수도 있고 여러 개일 수도 있으므로 배열 형태로 반환하는 것이 일반적입니다.
    res.status(200).json({
      reviews: disabledReviews, // 배열 형태로 반환
      message: "작성자의 비활성화 치료 후기 조회 성공", // 메시지 수정
    });
  } catch (err) {
    console.error("작성자의 비활성화 치료 후기 조회 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// 승인 대기 후기 목록 조회
export const readPendingReviews = async (req, res) => {
  try {
    // reviews 컬렉션에서 approved 필드가 false인 문서들만 조회
    const pendingReviewsData = await db
      .collection("reviews")
      .where("approved", "==", false) // approved 필드가 false인 조건 추가
      .get();

    if (!reviewDoc.exists) {
      return res.status(404).json({ message: "내용을 찾을 수 없습니다." });
    }

    const pendingReviews = pendingReviewsData.docs.map((doc) => doc.data());

    res.status(200).json({
      reviews: pendingReviews,
      message: "승인 대기 치료 후기 목록 조회 성공",
    });
  } catch (err) {
    console.error("승인 대기 치료 후기 목록 조회 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// 후기 수정
export const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const files = req.files || {};
  const { value, error } = updateReviewSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      message: "Validation Error",
    });
  }

  try {
    const docRef = db.collection("reviews").doc(reviewId);
    const doc = await docRef.get();
    const now = Timestamp.now();

    if (!doc.exists) {
      return res.status(404).json({ message: "치료 후기를 찾을 수 없습니다." });
    }

    const existingData = doc.data();
    const existingImageUrls = existingData.imageUrls || [];

    // 1. 삭제할 이미지 목록 처리
    const deleteImageUrls = JSON.parse(req.body.deleteImageUrls || "[]");
    for (const url of deleteImageUrls) {
      const fileName = decodeURIComponent(url.split("/").pop());
      await bucket
        .file(fileName)
        .delete()
        .catch(() => {}); // 삭제 실패 무시
    }

    // 2. 기존 이미지 중 남겨둘 것만 추림
    const remainingImageUrls = existingImageUrls.filter(
      (url) => !deleteImageUrls.includes(url)
    );

    // 3. 새 이미지 업로드
    const imageFiles = files.reviewImg || [];
    const newImageUrls = [];

    for (const file of imageFiles) {
      const fileName = `image-${now}-${file.originalname}-${uuidv4()}`;
      const uploadRef = bucket.file(fileName);

      await uploadRef.save(file.buffer, {
        metadata: { contentType: file.mimetype },
        public: true,
      });

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      newImageUrls.push(publicUrl);
    }

    // 4. Firestore 업데이트 (남은 이미지 + 새 이미지)
    await docRef.update({
      ...value,
      imageUrls: [...remainingImageUrls, ...newImageUrls],
      updatedAt: now,
    });

    res.status(200).json({ message: "치료 후기 수정 성공" });
  } catch (err) {
    console.error("치료 후기 수정 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// 후기 활성화 승인 요청
export const requestReapproval = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const docRef = db.collection("reviews").doc(reviewId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "치료 후기를 찾을 수 없습니다." });
    }

    const now = Timestamp.now();

    await docRef.update({
      approved: false,
      updatedAt: now,
    });

    res.status(200).json({ message: "치료 후기 승인 요청 성공" });
  } catch (err) {
    console.error("치료 후기 승인 요청 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// 후기 활성화
export const enableReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const docRef = db.collection("reviews").doc(reviewId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "치료 후기를 찾을 수 없습니다." });
    }

    const now = Timestamp.now();

    await docRef.update({
      isPublic: true,
      approved: true,
      updatedAt: now,
    });

    res.status(200).json({ message: "치료 후기 활성화 성공" });
  } catch (err) {
    console.error("치료 후기 활성화 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// 후기 비활성화
export const disabledReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const docRef = db.collection("reviews").doc(reviewId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "치료 후기를 찾을 수 없습니다." });
    }

    const now = Timestamp.now();

    await docRef.update({
      ...value,
      isPublic: false,
      updatedAt: now,
    });

    res.status(200).json({ message: "치료 후기 비활성화 성공" });
  } catch (err) {
    console.error("치료 후기 비활성화 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// 후기 삭제
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const docRef = db.collection("reviews").doc(reviewId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "치료 후기를 찾을 수 없습니다." });
    }

    const data = doc.data();
    const imageUrls = data.imageUrls || [];

    // 1. Storage 이미지 삭제
    for (const url of imageUrls) {
      const fileName = decodeURIComponent(url.split("/").pop());
      await bucket
        .file(fileName)
        .delete()
        .catch(() => {}); // 실패해도 진행
    }

    // 2. Firestore 문서 삭제
    await docRef.delete();

    res.status(204).json({ message: "치료 후기 삭제 성공" });
  } catch (err) {
    console.error("치료 후기 삭제 에러:", err);
    res.status(500).json({ error: err.message });
  }
};
