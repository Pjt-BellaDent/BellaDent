// packages/functions/src/index.js

const { onRequest } = require("firebase-functions/v2/https");
const { defineString } = require("firebase-functions/params");
const cors = require("cors");

// --- Firebase Admin SDK 임포트 및 명시적 초기화 ---
const admin = require("firebase-admin");

// Admin SDK가 초기화되지 않았다면 초기화합니다.
// Functions 환경에서 자동 초기화될 가능성이 높지만, 문제가 지속되면 이 코드를 추가합니다.
if (admin.apps.length === 0) {
  console.log("Initializing Firebase Admin SDK explicitly.");
  admin.initializeApp();
}
// 이 초기화는 함수 인스턴스가 처음 로드될 때 한 번만 실행됩니다.

// --- 필요한 라이브러리 임포트 ---
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- Parameterized Configuration 정의 (API 키) ---
const geminiApiKey = defineString("GEMINI_API_KEY", {
  label: "Your Google Gemini API Key",
  description:
    "API key for accessing the Google Gemini API for text generation.",
});

exports.chatWithGemini = onRequest(async (request, response) => {
  // --- CORS 미들웨어 적용 ---
  cors({ origin: "*" })(request, response, async () => {
    // 이 안에서는 Admin SDK가 초기화되어 있다고 강하게 가정합니다.
    const db = admin.firestore(); // <-- 이제 여기서 안전하게 인스턴스 가져옵니다.

    const apiKey = geminiApiKey.value();

    if (!apiKey) {
      console.error("Configuration error: Gemini API Key is not set.");
      response.status(500).json({
        error: "Server configuration error: Gemini API Key is missing.",
      });
      return;
    }

    try {
      // ... (클라이언트로부터 받은 질문 추출) ...
      const question = request.body.message;
      if (!question) {
        // <<< 이 if 문의 시작 부분이 50번째 줄일 수 있습니다.
        console.error("No message received in request body.");
        response
          .status(400)
          .json({ error: "Bad Request: 'message' not found in request body." });
        return; // 요청 처리를 중단하고 함수 종료
      }
      console.log("Received question:", question);

      // --- 1. Firestore에서 FAQ 데이터 가져오기 ---
      // 이제 db 인스턴스를 사용합니다.
      const faqsRef = db.collection("faqs");
      const snapshot = await faqsRef.get();

      // ... (FAQ 컨텍스트 구성) ...
      let faqContext = "";
      if (!snapshot.empty) {
        // <<< 이 if 문이 65번째 줄 근처일 수 있습니다.
        console.log(`Fetched ${snapshot.size} FAQ documents from Firestore.`);
        faqContext += "병원 FAQ:\n";
        snapshot.forEach((doc) => {
          const faq = doc.data();
          if (faq.question && faq.answer) {
            faqContext += `질문: ${faq.question}\n답변: ${faq.answer}\n\n`;
          }
        });
        // TODO: 프롬프트 길이 제한 로직 추가
      } else {
        // <<< else 부분
        console.log("No FAQ documents found in Firestore 'faqs' collection.");
        faqContext = "병원 FAQ 정보가 없습니다.\n";
      }
      console.log(
        `FAQ Context included in prompt:\n ${faqContext.substring(0, 500)}...`
      );

      // --- 2. Gemini API 클라이언트 및 생성 모델 초기화 ---
      const genAI = new GoogleGenerativeAI(apiKey);
      const generativeModel = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      // --- 3. 생성 모델에게 보낼 프롬프트 구성 (RAG 패턴) ---
      const prompt = `
당신은 [병원 이름]의 친절한 챗봇입니다. 다음 제공된 FAQ 정보를 바탕으로 사용자의 질문에 답변해주세요.
만약 제공된 정보만으로는 사용자의 질문에 답변할 수 없다면, '죄송합니다, 해당 정보는 제가 가지고 있지 않습니다.' 와 같이 답변해주세요.
자신이 AI 모델이라는 언급이나, 제공된 정보 외의 일반적인 정보는 답변에 포함하지 마세요.

**모든 응답은 반드시 한국어로 해주세요.**

${faqContext} // Firestore에서 가져온 FAQ 컨텍스트 포함

사용자 질문: ${question}

답변:
`;
      console.log(`Generated Prompt:\n ${prompt.substring(0, 500)}...`);

      // --- 4. Gemini API 호출하여 답변 생성 ---
      const apiResponse = await generativeModel.generateContent(prompt);
      const geminiResponseText = apiResponse.response.text();
      console.log("--- Data received from Gemini API ---");
      console.log("Raw API Response:", apiResponse.response.text());
      console.log("-----------------------------------");

      // --- 5. Function 응답 전송 ---
      response.status(200).json({
        status: "success",
        geminiResponse: {
          text: geminiResponseText,
        },
      });
      console.log("Function response sent with Gemini data.");
    } catch (error) {
      console.error("Error during Function execution:", error);
      if (!response.headersSent) {
        response
          .status(500)
          .json({ error: `Error processing your request: ${error.message}` });
      }
    }
  }); // cors 미들웨어 콜백 끝
}); // onRequest 콜백 끝
