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
    const noticesDoc = await db
      .collection("notices")
      .orderBy("createdAt", "desc")
      .get();

    // Promise.all을 사용하여 각 공지사항의 작성자 이름을 병렬로 조회
    const noticesData = await Promise.all(
      noticesDoc.docs.map(async (doc) => {
        const data = doc.data();
        let authorName = "알 수 없음"; // 기본값

        if (data.authorId) {
          // 공지사항에도 authorId 필드가 있다고 가정
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
              `Error fetching author name for notice ${doc.id}:`,
              userErr.message
            );
          }
        }

        return {
          id: doc.id,
          ...data,
          authorName: authorName, // <-- authorName 필드 추가
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : null,
        };
      })
    );

    if (noticesDoc.empty) {
      console.log("readAllNotices: 공지사항 내용이 없습니다.");
      return res
        .status(200)
        .json({ notices: [], message: "내용을 찾을 수 없습니다." });
    }

    res
      .status(200)
      .json({ notices: noticesData, message: "전체 공지 사항 조회 성공" });
  } catch (err) {
    console.error("readAllNotices 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// 비활성화 공지 사항 조회
export const readDisabledNoticesById = async (req, res) => {
  try {
    const disabledNoticesData = await db
      .collection("notices")
      .where("isPublic", "==", false)
      .get();

    if (disabledNoticesData.empty) {
      console.log("readDisabledNoticesById: 비활성화된 공지사항 내용이 없습니다.");
      return res.status(200).json({ notices: [], message: "비활성화된 내용을 찾을 수 없습니다." });
    }

    // Promise.all을 사용하여 각 공지사항의 작성자 이름을 병렬로 조회
    const disabledNotices = await Promise.all(disabledNoticesData.docs.map(async doc => {
      const data = doc.data();
      let authorName = '알 수 없음';

      if (data.authorId) {
        try {
          const userDoc = await db.collection('users').doc(data.authorId).get();
          if (userDoc.exists) {
            authorName = userDoc.data().name || '이름 없음';
          }
        } catch (userErr) {
          console.warn(`Error fetching author name for disabled notice ${doc.id}:`, userErr.message);
        }
      }

      return {
        id: doc.id,
        ...data,
        authorName: authorName, // <-- authorName 필드 추가
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : null,
      };
    }));

    res.status(200).json({
      notices: disabledNotices,
      message: "작성자의 비활성화 공지 사항 조회 성공",
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
export const deleteNotice = async (req, res) => {
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
