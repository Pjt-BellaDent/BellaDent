// src/controllers/faqController.js
import { db } from "../config/firebase.js";
import { faqSchema, updateFaqSchema } from "../models/faq.js";
import { Timestamp } from "firebase-admin/firestore";


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

export const readAllFaqs = async (req, res) => {
  try {
    const snapshot = await db
      .collection("faqs")
      .where("isPublic", "==", true)
      .orderBy("createdAt", "desc")
      .get();

    const faqs = await Promise.all(
      snapshot.docs.map(async (doc) => {
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
              `Error fetching author name for FAQ ${doc.id}:`,
              userErr.message
            );
          }
        }

        return {
          id: doc.id,
          ...data,
          authorName: authorName,
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

export const createFaq = async (req, res) => {
  const { value, error } = faqSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    return handleValidationError(res, error, "createFaq");
  }

  const { question, answer, authorId, isPublic, startTime, endTime } = value;

  try {
    const now = Timestamp.now();
    const newFaq = {
      question,
      answer,
      authorId,
      isPublic: typeof isPublic === "boolean" ? isPublic : true,
      createdAt: now,
      updatedAt: now,
      startTime: startTime ? Timestamp.fromDate(new Date(startTime)) : null,
      endTime: endTime ? Timestamp.fromDate(new Date(endTime)) : null,
    };

    const docRef = await db.collection("faqs").add(newFaq);

    res.status(201).json({
      id: docRef.id,
      ...newFaq,
      createdAt: newFaq.createdAt.toDate(),
      updatedAt: newFaq.updatedAt.toDate(),
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

export const updateFaq = async (req, res) => {
  const { id } = req.params;

  const { value, error } = updateFaqSchema.validate(
    { ...req.body, id: req.params.id },
    {
      abortEarly: false,
      allowUnknown: true,
    }
  );

  if (error) {
    return handleValidationError(res, error, "updateFaq");
  }

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

    updateData.updatedAt = Timestamp.now();

    await faqRef.update(updateData);

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
          authorName: authorName,
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
