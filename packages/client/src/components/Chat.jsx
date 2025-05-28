import React, { useState, useEffect } from 'react';
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
  background-color: ${({ type }) => (type === 'staff' ? '#007bff' : '#dbe3ef')};
  color: ${({ type }) => (type === 'staff' ? '#fff' : '#333')};
  align-self: ${({ type }) => (type === 'patient' ? 'flex-end' : 'flex-start')};
`;

const TypingBubble = styled.div`
  width: 50px;
  height: 36px;
  border-radius: 20px;
  background: #dbe3ef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #777;
  align-self: flex-start;

  &::after {
    content: '...';
    animation: blink 1.2s infinite;
  }

  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0.3; }
    100% { opacity: 1; }
  }
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
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: #f0f0f5;
  }
`;

const Chat = () => {
  const [inputText, setInputText] = useState('');
  const [activeUser, setActiveUser] = useState(null);
  const [unreadList, setUnreadList] = useState(['김철수']);
  const [typingUsers, setTypingUsers] = useState([]);

  const userList = ['김철수', '이은정', 'AI 진료 봇'];

  const [chatData, setChatData] = useState({});

  useEffect(() => {
    const initialChats = {};
    userList.forEach((name) => {
      initialChats[name] = [
        {
          type: 'staff', // 처음 메시지도 직원 메시지
          text: `안녕하세요. ${name}님. 무엇을 도와드릴까요?`
        }
      ];
    });
    setChatData(initialChats);
  }, []);

  const messages = activeUser ? chatData[activeUser] || [] : [];
  const isTyping = activeUser && typingUsers.includes(activeUser);

  useEffect(() => {
    if (!activeUser) return;

    if (inputText.trim()) {
      if (!typingUsers.includes(activeUser)) {
        setTypingUsers(prev => [...prev, activeUser]);
      }
    }

    const timeout = setTimeout(() => {
      setTypingUsers(prev => prev.filter(name => name !== activeUser));
    }, 2000);

    return () => clearTimeout(timeout);
  }, [inputText, activeUser]);

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text || !activeUser) return;

    const newMessage = { type: 'staff', text };

    setChatData(prev => ({
      ...prev,
      [activeUser]: [...(prev[activeUser] || []), newMessage]
    }));

    setInputText('');
    setTypingUsers(prev => prev.filter(name => name !== activeUser));
  };

  const handleChatClick = (name) => {
    setUnreadList(prev => prev.filter(n => n !== name));
    setActiveUser(name);
  };

  return (
    <ChatWrapper>
      <ChatList>
        <h3>고객 채팅 목록</h3>
        {userList.map(name => (
          <ChatItem key={name} onClick={() => handleChatClick(name)}>
            <span>{name}</span>
            {(!activeUser || name !== activeUser) && typingUsers.includes(name) && (
              <span style={{ color: '#777' }}>...</span>
            )}
          </ChatItem>
        ))}
      </ChatList>

      <ChatRoom>
        <ChatHeader>
          {activeUser ? `${activeUser}님과 상담 중` : '상담 선택 대기 중'}
        </ChatHeader>
        <ChatMessages>
          {activeUser && messages.map((msg, idx) => (
            <Message key={idx} type={msg.type}>{msg.text}</Message>
          ))}
          {isTyping && <TypingBubble />}
        </ChatMessages>
        <ChatInput>
          <Input
            type="text"
            placeholder="답변을 입력하세요..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            disabled={!activeUser}
          />
          <Button onClick={sendMessage} disabled={!activeUser}>전송</Button>
        </ChatInput>
      </ChatRoom>
    </ChatWrapper>
  );
};

export default Chat;
