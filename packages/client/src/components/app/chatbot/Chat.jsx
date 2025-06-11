import React, { useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([
    { from: 'user', text: '진료는 몇 시까지 하나요?' },
    { from: 'bot', text: '평일 9시~18시 / 토요일 9시~13시 운영, 일요일/공휴일 휴무입니다.' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = { from: 'user', text: input };
    setMessages([...messages, newMessage]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: '문의하신 내용은 확인 후 답변드리겠습니다.' },
      ]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">💬 AI 챗봇 상담</h2>

      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] text-sm px-4 py-2 rounded-lg whitespace-pre-wrap ${
              msg.from === 'user'
                ? 'ml-auto bg-blue-100 text-right'
                : 'mr-auto bg-gray-100 text-left'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border px-4 py-2 rounded text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="질문을 입력하세요..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default Chat;
