import { db } from "../config/firebase.js";
import { faqSchema, updateFaqSchema } from "../models/faq.js"; // Joi 스키마 임포트
import { Timestamp } from "firebase-admin/firestore";

/**
 * @function handleValidationError
 * @description Joi 유효성 검사 오류를 처리하고 표준화된 응답을 보냅니다.
 * @param {object} res - Express 응답 객체
 * @param {object} error - Joi 유효성 검사 오류 객체
 * @param {string} functionName - 오류가 발생한 함수 이름 (로그용)
 * @returns {Response} 400 Bad Request 응답
 */
const handleValidationError = (
  res,
  error,
  functionName = "Unknown Function"
) => {
  console.error(`${functionName} Validation Error:`, error.details);
  return res.status(400).json({
    message: "Validation Error",
    details: error.details.map((d) => ({
      path: d.path,
      message: d.message,
    })),
  });
};

// FAQ 전체 조회 (공개된 FAQ만 조회)
export const readAllFaqs = async (req, res) => {
  try {
    const snapshot = await db
      .collection("faqs")
      .where("isPublic", "==", true)
      .orderBy("createdAt", "desc")
      .get();

    // Promise.all을 사용하여 각 FAQ의 작성자 이름을 병렬로 조회
    const faqs = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        let authorName = "알 수 없음"; // 기본값

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
              `Error fetching author name for FAQ ${doc.id}:`,
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
          startTime: data.startTime?.toDate ? data.startTime.toDate() : null,
          endTime: data.endTime?.toDate ? data.endTime.toDate() : null,
        };
      })
    );
    res.status(200).json({ faqs: faqs });
  } catch (err) {
    console.error("Error in readAllFaqs:", err);
    res.status(500).json({ error: err.message });
  }
};

// FAQ 생성
export const createFaq = async (req, res) => {
  const { value, error } = faqSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    return handleValidationError(res, error, "createFaq");
  }

  // Joi 검증을 통과한 데이터 사용
  // isPublic이 Joi 스키마에서 default(true)로 설정되어 있다면, 여기서는 isPublic 값을 그대로 사용하면 됩니다.
  const { question, answer, authorId, isPublic, startTime, endTime } = value; // isPublic은 Joi에서 기본값이 설정됨
  // startTime, endTime도 Joi에서 null 허용됨

  try {
    const now = Timestamp.now();
    const newFaq = {
      question,
      answer,
      authorId,
      isPublic: typeof isPublic === "boolean" ? isPublic : true, // 안전을 위해 명시적 타입 체크 및 기본값 설정
      createdAt: now,
      updatedAt: now,
      // startTime과 endTime은 Joi에서 검증된 값이 들어오므로, null이면 null, 아니면 Timestamp 변환
      startTime: startTime ? Timestamp.fromDate(new Date(startTime)) : null,
      endTime: endTime ? Timestamp.fromDate(new Date(endTime)) : null,
    };

    const docRef = await db.collection("faqs").add(newFaq);

    res.status(201).json({
      id: docRef.id,
      ...newFaq,
      createdAt: newFaq.createdAt.toDate(),
      updatedAt: newFaq.updatedAt.toDate(),
      // startTime, endTime도 응답 시 Date 객체로 변환 (null이면 그대로 null)
      startTime:
        newFaq.startTime instanceof Timestamp
          ? newFaq.startTime.toDate()
          : null,
      endTime:
        newFaq.endTime instanceof Timestamp ? newFaq.endTime.toDate() : null,
    });
  } catch (err) {
    console.error("Error in createFaq:", err);
    res.status(500).json({ error: err.message });
  }
};

// FAQ 수정
export const updateFaq = async (req, res) => {
  const { id } = req.params;

  // Joi 유효성 검사
  const { value, error } = updateFaqSchema.validate(
    { ...req.body, id: req.params.id },
    {
      // req.params.id도 검증에 포함
      abortEarly: false,
      allowUnknown: true,
    }
  );

  if (error) {
    return handleValidationError(res, error, "updateFaq");
  }

  // Joi 검증을 통과한 데이터 사용 (id는 params에서 가져오므로 여기서는 사용하지 않음)
  const { question, answer, isPublic, startTime, endTime } = value;

  try {
    const faqRef = db.collection("faqs").doc(id);
    const faqDoc = await faqRef.get();

    if (!faqDoc.exists) {
      return res.status(404).json({ message: "해당 FAQ를 찾을 수 없습니다." });
    }

    const updateData = {};
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (startTime !== undefined)
      updateData.startTime = startTime
        ? Timestamp.fromDate(new Date(startTime))
        : null;
    if (endTime !== undefined)
      updateData.endTime = endTime
        ? Timestamp.fromDate(new Date(endTime))
        : null;

    updateData.updatedAt = Timestamp.now(); // 업데이트 시 updatedAt 갱신

    await faqRef.update(updateData);

    // 업데이트된 문서의 최신 데이터를 가져옴
    const updatedDoc = await faqRef.get();
    const updatedFaqData = updatedDoc.data();

    res.status(200).json({
      id: updatedDoc.id,
      ...updatedFaqData,
      createdAt: updatedFaqData.createdAt?.toDate
        ? updatedFaqData.createdAt.toDate()
        : updatedFaqData.createdAt,
      updatedAt: updatedFaqData.updatedAt?.toDate
        ? updatedFaqData.updatedAt.toDate()
        : updatedFaqData.updatedAt,
      startTime: updatedFaqData.startTime
        ? updatedFaqData.startTime.toDate()
        : null,
      endTime: updatedFaqData.endTime ? updatedFaqData.endTime.toDate() : null,
    });
  } catch (err) {
    console.error("Error in updateFaq:", err);
    res.status(500).json({ error: err.message });
  }
};

// FAQ 삭제
export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faqRef = db.collection("faqs").doc(id);
    const faqDoc = await faqRef.get();

    if (!faqDoc.exists) {
      return res
        .status(404)
        .json({ message: "삭제하려는 FAQ를 찾을 수 없습니다." });
    }

    await faqRef.delete();
    res.status(200).json({ message: "FAQ 삭제 완료" });
  } catch (err) {
    console.error("Error in deleteFaq:", err);
    res.status(500).json({ error: err.message });
  }
};

// 비활성화 F&Q 조회
export const readDisabledFaqsById = async (req, res) => {
  try {
    const disabledFaqsData = await db
      .collection("faqs")
      .where("isPublic", "==", false)
      .get();

    if (disabledFaqsData.empty) {
      return res
        .status(200)
        .json({ faqs: [], message: "비활성화된 내용을 찾을 수 없습니다." });
    }

    // Promise.all을 사용하여 각 FAQ의 작성자 이름을 병렬로 조회
    const disabledFaqs = await Promise.all(
      disabledFaqsData.docs.map(async (doc) => {
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
              `Error fetching author name for disabled FAQ ${doc.id}:`,
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

    res.status(200).json({
      faqs: disabledFaqs,
      message: "작성자의 비활성화 F&Q 조회 성공",
    });
  } catch (err) {
    console.error("작성자의 비활성화 F&Q 조회 에러:", err);
    res.status(500).json({ error: err.message });
  }
};

// F&Q 활성화 (여기서는 Joi 스키마 필요 없음)
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

// F&Q 비활성화 (여기서는 Joi 스키마 필요 없음)
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
