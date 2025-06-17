// packages/functions/src/index.js

const { onRequest } = require("firebase-functions/v2/https");
const functions = require("firebase-functions"); // ✅ config 사용을 위해 필요
const cors = require("cors");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Admin SDK 초기화
if (admin.apps.length === 0) {
  admin.initializeApp();
}

exports.chatWithGemini = onRequest(async (request, response) => {
  cors({ origin: "*" })(request, response, async () => {
    const db = admin.firestore();

    // ✅ 무료 요금제에서도 가능한 config() 사용
    const apiKey = functions.config().gemini.key;

    if (!apiKey) {
      console.error("GEMINI API KEY 누락");
      return response.status(500).json({
        error: "Server configuration error: Gemini API Key is missing.",
      });
    }

    try {
      const question = request.body.message;
      if (!question) {
        return response.status(400).json({ error: "'message' not found." });
      }

      const snapshot = await db.collection("faqs").get();
      let faqContext = "";

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          const faq = doc.data();
          if (faq.question && faq.answer) {
            faqContext += `질문: ${faq.question}\n답변: ${faq.answer}\n\n`;
          }
        });
      } else {
        faqContext = "병원 FAQ 정보가 없습니다.\n";
      }

      const prompt = `
당신은 [병원 이름]의 친절한 챗봇입니다.
FAQ를 참고하여 사용자 질문에 한국어로 답해주세요.

${faqContext}

사용자 질문: ${question}
답변:
      `;

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent(prompt);
      const answer = result.response.text();

      response.status(200).json({
        status: "success",
        geminiResponse: {
          text: answer,
        },
      });
    } catch (error) {
      console.error("Gemini 처리 오류:", error);
      if (!response.headersSent) {
        response.status(500).json({ error: error.message });
      }
    }
  });
});
