import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const GeminiChat = async (req, res) => {
  try {
    // 1. 클라이언트 요청에서 데이터 (질문) 추출
    const question = req.body.message;

    if (!question) {
      console.error("Express Server: No message received from client.");
      return res
        .status(400)
        .json({ error: "Bad Request: 'message' not found in request body." });
    }

    console.log("Express Server: Received question from client:", question);

    // 2. 추출한 데이터를 Firebase Function으로 전송 (Axios 사용)
    const functionResponse = await axios.post(
      process.env.FIREBASE_FUNCTION_URL,
      {
        // Function에게 보낼 데이터 (Function이 request.body.message로 받도록)
        message: question,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        // 필요한 경우 Function 호출에 대한 인증 토큰 등을 여기에 추가할 수 있습니다.
        // 예: Firebase Authentication 토큰을 Function에서 검증해야 한다면 클라이언트에서 토큰을 받아
        // Function 호출 시 헤더에 포함시킵니다.
        // headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${clientAuthToken}` }
      }
    );

    // 3. Function으로부터 받은 응답을 클라이언트에게 다시 전송
    console.log(
      "Express Server: Received response from Function:",
      functionResponse.data
    );
    res.status(functionResponse.status).json(functionResponse.data); // Function의 상태 코드와 본문을 그대로 전달
  } catch (error) {
    // Function 호출 중 오류 발생 시 처리
    console.error("Express Server: Error calling Firebase Function:", error);

    // Function에서 보낸 에러 응답이 있다면 그것을 클라이언트에게 전달
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      // Function이 응답을 보내지 않았거나 네트워크 오류인 경우
      res
        .status(500)
        .json({
          error:
            "Internal Server Error: Failed to communicate with the backend function.",
        });
    }
  }
};