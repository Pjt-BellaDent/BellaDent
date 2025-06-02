import { db } from "../config/firebase.js";
import { reviewSchema, updateReviewSchema } from "../models/review.js";

export const readAllReviews = async (req, res) => {
  try {
    const reviewsData = await db.collection("reviews").get();

    res.status(201).json({ reviewsData, message: "전체 이용 후기 조회 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const readReviewById = async (req, res) => {
  try {
    const reviewsData = await db
      .collection("reviews")
      .where("id", "==", req.body.id)
      .get();

    if (reviewsData.empty) {
      return res.status(404).json({ message: "내용을 찾을 수 없습니다." });
    }

    res.status(201).json({ reviewsData, message: "이용 후기 조회 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createReview = async (req, res) => {
  const { value, error } = reviewSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  try {
    const docRef = db.collection("review").doc(value.id);
    await docRef.set(value);
    res.status(201).json({ message: "이용 후기 등록 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateReview = async (req, res) => {
  const { value, error } = updateReviewSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .json({ message: "Validation Error", details: error.details });
  }

  try {
    const docRef = db.collection("review").doc(req.params.id);
    await docRef.update(value);
    res.status(201).json({ message: "이용 후기 수정 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const deleteReview = async (req, res) => {
  try {
    const docRef = db.collection("review").doc(req.params.id);
    await docRef.delete();

    res.status(201).json({ message: "이용 후기 삭제 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
