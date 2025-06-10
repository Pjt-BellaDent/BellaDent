// 🔧 직원용 Chat.jsx (입력 중 표시까지 포함된 전체 코드)
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';


const ChatWrapper = styled.div`
  display: flex;
  height: 100vh;
`;
const ChatList = styled.div`
  width: 200px;
  background: #f7f7f7;
  border-right: 1px solid #ccc;
`;
const ChatRoom = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const ChatHeader = styled.div`
  background: #fff;
  padding: 10px;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
`;
const ChatMessages = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: #e9edf5;
`;
const Message = styled.div`
  background: ${(props) => (props.type === 'staff' ? '#cfe2ff' : '#fff3cd')};
  padding: 8px;
  margin: 6px 0;
  border-radius: 6px;
  max-width: 60%;
`;
const TypingBubble = styled.div`
  font-style: italic;
  color: #888;
  margin-left: 10px;
`;
const ChatInput = styled.div`
  display: flex;
  border-top: 1px solid #ccc;
  padding: 10px;
`;
const Input = styled.input`
  flex: 1;
  padding: 8px;
  margin-right: 10px;
`;
const Button = styled.button`
  padding: 8px 12px;
  background-color: #2f80ed;
  color: white;
  border: none;
  border-radius: 4px;
`;
const ChatItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;

  &:hover {
    background: #eee;
  }
`;

const Chat = () => {
  const [inputText, setInputText] = useState('');
  const [activeUser, setActiveUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [chatData, setChatData] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [staffUid] = useState('STAFF_UID'); // TODO: 실제 로그인 정보로 교체

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
      setChatData(prev => ({ ...prev, [activeUser]: msgs }));
    });
    return () => unsub();
  }, [activeUser]);

  // 입력 중 상태 구독
  useEffect(() => {
    if (!activeUser) return;
    const unsub = onSnapshot(doc(db, 'consultations', activeUser), (docSnap) => {
      const data = docSnap.data();
      setIsTyping(data?.typing || false);
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
      status: 'responded',
      typing: false,
    });

    setInputText('');
  };

  const handleChatClick = (consultationId) => {
    setActiveUser(consultationId);
  };

  return (
    <ChatWrapper>
      <ChatList>
        <h3 style={{ padding: '10px' }}>상담 목록</h3>
        {userList.map(user => (
          <ChatItem key={user.id} onClick={() => handleChatClick(user.id)}>
            <span>{user.name}</span>
          </ChatItem>
        ))}
      </ChatList>

      <ChatRoom>
        <ChatHeader>
          {activeUser ? `${userList.find(u => u.id === activeUser)?.name} 상담 중` : '상담 선택 대기 중'}
        </ChatHeader>
        <ChatMessages>
          {messages.map((msg, idx) => (
            <Message key={idx} type={msg.senderType}>{msg.content}</Message>
          ))}
          {isTyping && <TypingBubble>입력 중...</TypingBubble>}
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
