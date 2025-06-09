// src/components/GeminiChat.js (수정된 부분)

import React, { useState, useCallback } from 'react';
import axios from 'axios';

// !!! 변경됨 !!! 이제 Express 서버의 엔드포인트 URL을 가리킵니다.
// 예: React 앱이 http://localhost:5173에서 실행된다면, Express 서버는 다른 포트 (예: 3001)에서 실행될 수 있습니다.
// 이 경우 Express 서버의 엔드포인트는 http://localhost:3001/api/chat 과 같이 될 수 있습니다.
// React 앱과 Express 서버가 같은 도메인의 다른 경로에 호스팅된다면 상대 경로로 '/api/chat' 만 사용해도 됩니다.
const YOUR_EXPRESS_SERVER_URL = 'http://localhost:3000/aiChat/ai';

function GeminiChat() {
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
      const result = await axios.post(
        YOUR_EXPRESS_SERVER_URL,
        { message: question },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log('Express server response:', result.data);
      setResponse(result.data);
    } catch (err) {
      console.error('Error calling Express server:', err);
      setError(err.response?.data || err.message || '알 수 없는 오류 발생');
    } finally {
      setLoading(false);
    }
  }, [question]);

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        handleSendQuestion();
      }
    },
    [handleSendQuestion]
  );

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Gemini Chat with Firebase Functions</h1>

      <div>
        <label htmlFor="questionInput">질문:</label>
        <input
          type="text"
          id="questionInput"
          value={question}
          onChange={handleQuestionChange}
          onKeyPress={handleKeyPress}
          style={{ width: '80%', marginRight: '10px' }}
          disabled={loading}
        />
        <button onClick={handleSendQuestion} disabled={loading}>
          {loading ? '전송 중...' : 'Gemini에게 질문하기'}
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
          whiteSpace: 'pre-wrap',
        }}
      >
        {loading && <p>Gemini가 생각하고 있습니다...</p>}
        {error && <p style={{ color: 'red' }}>오류: {String(error)}</p>}
        {response && (
          <div>
            <p>상태: {response.status}</p>
            {response.geminiResponse && response.geminiResponse.text && (
              <p>응답 내용: {response.geminiResponse.text}</p>
            )}
          </div>
        )}
        {!loading && !error && !response && (
          <p>질문을 입력하고 'Gemini에게 질문하기' 버튼을 누르세요.</p>
        )}
      </div>
    </div>
  );
}

export default GeminiChat;

