// src/components/GeminiChat.js (수정된 부분)

import React, { useState, useCallback } from 'react';
import axios from 'axios';

// !!! 변경됨 !!! 이제 Express 서버의 엔드포인트 URL을 가리킵니다.
// 예: React 앱이 http://localhost:5173에서 실행된다면, Express 서버는 다른 포트 (예: 3001)에서 실행될 수 있습니다.
// 이 경우 Express 서버의 엔드포인트는 http://localhost:3001/api/chat 과 같이 될 수 있습니다.
// React 앱과 Express 서버가 같은 도메인의 다른 경로에 호스팅된다면 상대 경로로 '/api/chat' 만 사용해도 됩니다.
const YOUR_EXPRESS_SERVER_URL = 'http://localhost:3000/chat/ai'; // <-- 이 부분을 수정하세요!
// 예: 'http://localhost:3001/api/chat' 또는 '/api/chat'

function GeminiChat() {
  // ... 이전과 동일한 useState, useCallback 훅스 ...
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuestionChange = useCallback((event) => {
    setQuestion(event.target.value);
  }, []);

  const handleSendQuestion = useCallback(async () => {
    if (!question.trim()) {
      alert('질문을 입력해주세요!');
      return;
    }

    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      // !!! Axios 호출 대상 변경 !!! Firebase Function 대신 Express 서버로 요청
      const result = await axios.post(
        YOUR_EXPRESS_SERVER_URL,
        {
          message: question, // Express 서버에게 보낼 데이터
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Express 서버로부터 받은 응답 데이터(result.data)를 상태에 저장
      setResponse(result.data);
    } catch (err) {
      console.error('Error calling Express server:', err); // 로그 메시지 변경
      setError(err.response?.data || err.message || '알 수 없는 오류 발생');
    } finally {
      setLoading(false);
    }
  }, [question, YOUR_EXPRESS_SERVER_URL]); // 의존성 배열 업데이트

  // 엔터 키를 눌렀을 때 질문 전송 (선택 사항)
  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        handleSendQuestion();
      }
    },
    [handleSendQuestion]
  );

  return (
    <div>
      <h1>Gemini Chat with Firebase Functions</h1>

      <div>
        <label htmlFor="questionInput">질문:</label>
        <input
          type="text"
          id="questionInput"
          value={question} // 상태 값과 입력 필드 연결 (controlled component)
          onChange={handleQuestionChange} // 입력 값 변경 핸들러
          onKeyPress={handleKeyPress} // 엔터 키 핸들러 추가
          style={{ width: '80%', marginRight: '10px' }}
          disabled={loading} // 로딩 중에는 입력 비활성화
        />
        <button
          onClick={handleSendQuestion} // 버튼 클릭 핸들러
          disabled={loading} // 로딩 중에는 버튼 비활성화
        >
          {loading ? '전송 중...' : 'Gemini에게 질문하기'}{' '}
          {/* 로딩 상태에 따라 버튼 텍스트 변경 */}
        </button>
      </div>

      <h2>응답:</h2>
      <div
        id="responseArea"
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          minHeight: '100px',
          marginTop: '10px',
          whiteSpace: 'pre-wrap', // 줄 바꿈 유지
        }}
      >
        {/* 상태 값에 따라 표시 내용 변경 */}
        {loading && <p>Gemini가 생각하고 있습니다...</p>}
        {error && <p style={{ color: 'red' }}>오류: {String(error)}</p>}{' '}
        {/* 오류 메시지 표시 */}
        {response && (
          <div>
            {/* 함수의 응답 구조에 맞게 표시 */}
            {/* 예시: 함수가 { status: "success", geminiResponse: { text: "..." } } 형태로 응답을 보냈다면 */}
            <p>상태: {response.status}</p>
            {response.geminiResponse && response.geminiResponse.text && (
              <p>응답 내용: {response.geminiResponse.text}</p>
            )}
            {/* 만약 함수가 다른 형태로 응답했다면 그에 맞게 수정 */}
            {/* 예: JSON 전체를 그대로 표시하고 싶다면 */}
            {/* <pre>{JSON.stringify(response, null, 2)}</pre> */}
          </div>
        )}
        {/* 초기 상태 또는 로딩/오류 후 */}
        {!loading && !error && !response && (
          <p>질문을 입력하고 'Gemini에게 질문하기' 버튼을 누르세요.</p>
        )}
      </div>
    </div>
  );
}

export default GeminiChat;
