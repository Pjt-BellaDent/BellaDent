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
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  try {
    const imageFiles = files.reviewImg || [];
    const imageUrls = [];
    const now = Timestamp.now();

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const fileName = `image-${now.toMillis()}-${
        file.originalname
      }-${uuidv4()}`;
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
      id: docRef.id,
      title: value.title,
      content: value.content, // Firestore에 'content'로 저장
      authorId: value.authorId,
      isPublic: value.isPublic,
      approved: value.approved,
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
    const reviewsDoc = await db
      .collection("reviews")
      .orderBy("createdAt", "desc")
      .get();

    const reviewsData = await Promise.all(
      reviewsDoc.docs.map(async (doc) => {
        const data = doc.data();
        let authorName = "알 수 없음";

        if (data.authorId) {
          try {
            const userDoc = await db
              .collection("users")
              .doc(data.authorId)
              .get();
            if (userDoc.exists) {
              authorName = userDoc.data().name || "이름 없음";
            }
          } catch (userErr) {
            console.warn(
              `Error fetching author name for review ${doc.id}:`,
              userErr.message
            );
          }
        }

        return {
          id: doc.id,
          title: data.title || "제목 없음",
          content: data.content, // ★★★ data.content로 직접 접근 ★★★
          authorId: data.authorId,
          authorName: authorName,
          imageUrls: data.imageUrls || [],
          isPublic: data.isPublic,
          approved: data.approved,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : null,
        };
      })
    );

    if (reviewsDoc.empty) {
      return res
        .status(200)
        .json({ reviews: [], message: "내용을 찾을 수 없습니다." });
    }

    res
      .status(200)
      .json({ reviews: reviewsData, message: "전체 치료 후기 조회 성공" });
  } catch (err) {
    console.error("readAllReviews 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// 후기 목록 조회 (작성자 ID)
export const readReviewsByAuthorId = async (req, res) => {
  const authorId = req.params.id;

  try {
    const reviewsDoc = await db
      .collection("reviews")
      .where("authorId", "==", authorId)
      .orderBy("createdAt", "desc")
      .get();

    const reviewsData = await Promise.all(
      reviewsDoc.docs.map(async (doc) => {
        const data = doc.data();
        let authorName = "알 수 없음";

        if (data.authorId) {
          try {
            const userDoc = await db
              .collection("users")
              .doc(data.authorId)
              .get();
            if (userDoc.exists) {
              authorName = userDoc.data().name || "이름 없음";
            }
          } catch (userErr) {
            console.warn(
              `Error fetching author name for review ${doc.id}:`,
              userErr.message
            );
          }
        }

        return {
          id: doc.id,
          title: data.title || "제목 없음",
          content: data.content, // ★★★ data.content로 직접 접근 ★★★
          authorId: data.authorId,
          authorName: authorName,
          imageUrls: data.imageUrls || [],
          isPublic: data.isPublic,
          approved: data.approved,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : null,
        };
      })
    );

    if (reviewsDoc.empty) {
      console.log(`readReviewsByAuthorId: User ${authorId} has no reviews.`);
      return res
        .status(200)
        .json({ reviews: [], message: "내용을 찾을 수 없습니다." });
    }

    res
      .status(200)
      .json({ reviews: reviewsData, message: "치료 후기 조회 성공" });
  } catch (err) {
    console.error("readReviewsByAuthorId 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// 단일 후기 조회 (Review ID)
export const readSingleReviewById = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const reviewDoc = await db.collection("reviews").doc(reviewId).get();

    if (!reviewDoc.exists) {
      console.log(
        `readSingleReviewById: Review document for ID: ${reviewId} does not exist.`
      );
      return res
        .status(404)
        .json({ message: "해당 치료 후기를 찾을 수 없습니다." });
    }

    const data = reviewDoc.data();
    let authorName = "알 수 없음";

    if (data.authorId) {
      try {
        const userDoc = await db.collection("users").doc(data.authorId).get();
        if (userDoc.exists) {
          authorName = userDoc.data().name || "이름 없음";
        }
      } catch (userErr) {
        console.warn(
          `Error fetching author name for single review ${reviewId}:`,
          userErr.message
        );
      }
    }

    const formattedReview = {
      id: reviewDoc.id,
      title: data.title || "제목 없음",
      content: data.content, // ★★★ data.content로 직접 접근 ★★★
      authorId: data.authorId,
      authorName: authorName,
      imageUrls: data.imageUrls || [],
      isPublic: data.isPublic,
      approved: data.approved,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : null,
    };

    // ★★★ { review: formattedReview, message: ... } 대신 formattedReview 자체를 반환 ★★★
    res.status(200).json(formattedReview);
  } catch (err) {
    console.error("readSingleReviewById 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// 비활성화 후기 목록 조회 (by authorId)
export const readDisabledReviewsByAuthorId = async (req, res) => {
  const authorId = req.params.id;

  try {
    const disabledReviewsData = await db
      .collection("reviews")
      .where("authorId", "==", authorId)
      .where("isPublic", "==", false)
      .orderBy("createdAt", "desc") // 정렬 기준 포함. 인덱스 필요
      .get();

    const disabledReviews = await Promise.all(
      disabledReviewsData.docs.map(async (doc) => {
        const data = doc.data();
        let authorName = "알 수 없음";

        if (data.authorId) {
          try {
            const userDoc = await db
              .collection("users")
              .doc(data.authorId)
              .get();
            if (userDoc.exists) {
              authorName = userDoc.data().name || "이름 없음";
            }
          } catch (userErr) {
            console.warn(
              `Error fetching author name for disabled review ${doc.id}:`,
              userErr.message
            );
          }
        }

        return {
          id: doc.id,
          title: data.title || "제목 없음",
          content: data.content, // ★★★ data.content로 직접 접근 ★★★
          authorId: data.authorId,
          authorName: authorName,
          imageUrls: data.imageUrls || [],
          isPublic: data.isPublic,
          approved: data.approved,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : null,
        };
      })
    );

    res.status(200).json({
      reviews: disabledReviews,
      message: "작성자의 비활성화 치료 후기 조회 성공",
    });
  } catch (err) {
    console.error("작성자의 비활성화 치료 후기 조회 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// 승인 대기 후기 목록 조회
export const readPendingReviews = async (req, res) => {
  try {
    const pendingReviewsData = await db
      .collection("reviews")
      .where("approved", "==", false)
      .orderBy("createdAt", "desc")
      .get();

    const pendingReviews = await Promise.all(
      pendingReviewsData.docs.map(async (doc) => {
        const data = doc.data();
        let authorName = "알 수 없음";

        if (data.authorId) {
          try {
            const userDoc = await db
              .collection("users")
              .doc(data.authorId)
              .get();
            if (userDoc.exists) {
              authorName = userDoc.data().name || "이름 없음";
            }
          } catch (userErr) {
            console.warn(
              `Error fetching author name for pending review ${doc.id}:`,
              userErr.message
            );
          }
        }

        return {
          id: doc.id,
          title: data.title || "제목 없음",
          content: data.content, // ★★★ data.content로 직접 접근 ★★★
          authorId: data.authorId,
          authorName: authorName,
          imageUrls: data.imageUrls || [],
          isPublic: data.isPublic,
          approved: data.approved,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : null,
        };
      })
    );

    if (pendingReviewsData.empty) {
      return res
        .status(200)
        .json({ reviews: [], message: "내용을 찾을 수 없습니다." });
    }

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
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
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

    const deleteImageUrls = JSON.parse(req.body.deleteImageUrls || "[]");
    for (const url of deleteImageUrls) {
      const fileName = decodeURIComponent(url.split("/").pop());
      await bucket
        .file(fileName)
        .delete()
        .catch(() => {});
    }

    const remainingImageUrls = existingImageUrls.filter(
      (url) => !deleteImageUrls.includes(url)
    );

    const imageFiles = files.reviewImg || [];
    const newImageUrls = [];

    for (const file of imageFiles) {
      const fileName = `review-${now.toMillis()}-${
        file.originalname
      }-${uuidv4()}`;
      const uploadRef = bucket.file(fileName);

      await uploadRef.save(file.buffer, {
        metadata: { contentType: file.mimetype },
        public: true,
      });

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      newImageUrls.push(publicUrl);
    }

    // ★★★ 'content' 필드를 업데이트 ★★★
    await docRef.update({
      title: value.title,
      content: value.content, // 'content' 필드를 업데이트
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
