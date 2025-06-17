import React, { useState } from 'react';
import styled from '@emotion/styled';

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const ChatList = styled.div`
  width: 250px;
  background: #fff;
  border-right: 1px solid #ccc;
  padding: 20px;
  overflow-y: auto;
`;

const ChatRoom = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #e9edf5;
`;

const ChatHeader = styled.div`
  padding: 15px;
  background: #fff;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Message = styled.div`
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 16px;
  background-color: ${({ type }) => (type === 'user' ? '#007bff' : type === 'ai' ? '#dbe3ef' : '#fff')};
  color: ${({ type }) => (type === 'user' ? '#fff' : '#333')};
  align-self: ${({ type }) => (type === 'user' ? 'flex-end' : 'flex-start')};
`;

const ChatInput = styled.div`
  padding: 15px;
  background: #fff;
  border-top: 1px solid #ddd;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
`;

const Button = styled.button`
  padding: 10px 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ChatItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:hover {
    background: #f0f0f5;
  }
`;

const Chat = () => {
  const [messages, setMessages] = useState([
    { type: 'ai', text: '안녕하세요! 무엇을 도와드릴까요?' }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    const newMessages = [...messages, { type: 'user', text }];
    setMessages(newMessages);
    setInputText('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'ai',
        text: `AI 응답: "${text}"에 대한 도움을 드릴게요!`
      }]);
    }, 500);
  };

  return (
    <ChatWrapper>
      <ChatList>
        <h3>고객 채팅 목록</h3>
        <ChatItem>🧑 김철수</ChatItem>
        <ChatItem>👩 이은정</ChatItem>
        <ChatItem>🧠 AI 진료 봇</ChatItem>
      </ChatList>

      <ChatRoom>
        <ChatHeader>AI 채팅 상담</ChatHeader>
        <ChatMessages>
          {messages.map((msg, idx) => (
            <Message key={idx} type={msg.type}>{msg.text}</Message>
          ))}
        </ChatMessages>
        <ChatInput>
          <Input
            type="text"
            placeholder="메시지를 입력하세요..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage}>전송</Button>
        </ChatInput>
      </ChatRoom>
    </ChatWrapper>
  );
};

export default Chat;
