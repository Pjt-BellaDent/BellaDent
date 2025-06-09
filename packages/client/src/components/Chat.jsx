// 🔧 관리자용 Chat.jsx 전체 코드 (Firestore 연동)

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { db } from '';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

const ChatWrapper = styled.div`/* ...동일 */`;
const ChatList = styled.div`/* ...동일 */`;
const ChatRoom = styled.div`/* ...동일 */`;
const ChatHeader = styled.div`/* ...동일 */`;
const ChatMessages = styled.div`/* ...동일 */`;
const Message = styled.div`/* ...동일 */`;
const TypingBubble = styled.div`/* ...동일 */`;
const ChatInput = styled.div`/* ...동일 */`;
const Input = styled.input`/* ...동일 */`;
const Button = styled.button`/* ...동일 */`;
const ChatItem = styled.div`/* ...동일 */`;

const Chat = () => {
  const [inputText, setInputText] = useState('');
  const [activeUser, setActiveUser] = useState(null); // consultationId
  const [userList, setUserList] = useState([]); // 상담 목록
  const [chatData, setChatData] = useState({});
  const [staffUid] = useState('STAFF_UID'); // TODO: 로그인된 직원 UID로 교체 필요

  const messages = activeUser ? chatData[activeUser] || [] : [];

  // 상담 목록 구독
  useEffect(() => {
    const q = query(collection(db, 'consultations'), orderBy('updatedAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().userId,
        status: doc.data().status
      }));
      setUserList(users);
    });
    return () => unsub();
  }, []);

  // 메시지 구독
  useEffect(() => {
    if (!activeUser) return;
    const msgRef = collection(db, `consultations/${activeUser}/messages`);
    const q = query(msgRef, orderBy('sentAt'));
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => doc.data());
      setChatData(prev => ({
        ...prev,
        [activeUser]: msgs
      }));
    });
    return () => unsub();
  }, [activeUser]);

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || !activeUser) return;

    const msgRef = collection(db, `consultations/${activeUser}/messages`);
    await addDoc(msgRef, {
      senderId: staffUid,
      senderType: 'staff',
      content: text,
      sentAt: serverTimestamp()
    });

    await updateDoc(doc(db, 'consultations', activeUser), {
      updatedAt: serverTimestamp(),
      handlerId: staffUid,
      status: 'responded'
    });

    setInputText('');
  };

  const handleChatClick = (consultationId) => {
    setActiveUser(consultationId);
  };

  return (
    <ChatWrapper>
      <ChatList>
        <h3>고객 채팅 목록</h3>
        {userList.map(user => (
          <ChatItem key={user.id} onClick={() => handleChatClick(user.id)}>
            <span>{user.name}</span>
            <span style={{ color: '#999', fontSize: '12px' }}>{user.status}</span>
          </ChatItem>
        ))}
      </ChatList>

      <ChatRoom>
        <ChatHeader>
          {activeUser ? `${userList.find(u => u.id === activeUser)?.name}님과 상담 중` : '상담 선택 대기 중'}
        </ChatHeader>
        <ChatMessages>
          {messages.map((msg, idx) => (
            <Message key={idx} type={msg.senderType}>{msg.content}</Message>
          ))}
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
