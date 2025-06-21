import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../contexts/UserInfoContext.jsx';
import axios from 'axios';
import io from 'socket.io-client';
import Modal from '../web/Modal.jsx';
import Title from '../web/Title.jsx';

function ChatForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ question: '' });
  const [messages, setMessages] = useState([]);
  const { userInfo, userToken } = useUserInfo();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isAiActive, setIsAiActive] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const socketRef = useRef(null);

  const currentUserId = userInfo?.id;

  useEffect(() => {
    if (!userInfo || !userToken) {
      console.log(
        'UserInfo 또는 UserToken이 아직 없습니다. 소켓 연결 및 데이터 가져오기를 건너뜁니다.'
      );
      return;
    }

    // --- 1. Socket.IO 클라이언트 초기화 및 연결 관리 ---
    if (!socketRef.current) {
      const newSocket = io('http://localhost:3000', {
        withCredentials: true,
        auth: {
          token: userToken,
        },
      });

      newSocket.on('connect', () => {
        console.log('ChatForm에서 Socket 연결됨!', newSocket.id);
        newSocket.emit('join', currentUserId);
      });

      newSocket.on('connect_error', (err) => {
        console.error('ChatForm에서 Socket 연결 오류:', err.message);
        setModalMessage('채팅 서버 연결 실패: ' + err.message);
        setShowModal(true);
      });

      newSocket.on('error', (err) => {
        console.error('ChatForm에서 Socket 오류:', err);
      });

      // --- newMessage 리스너 등록 (AI 답변 및 상대방 메시지 전용) ---
      const handleNewMessage = (msg) => {
        console.log('>>> handleNewMessage CALLED with:', msg);
        console.groupCollapsed(
          'ChatForm: handleNewMessage - New Message Received'
        );
        console.log('Msg Object:', msg);
        console.log('Msg ID:', msg.id);
        console.log('Msg Sender ID:', msg.senderId);
        console.log('Current User ID:', currentUserId);
        console.log('Msg Content:', msg.content);
        console.log('Msg Sender Type:', msg.senderType);

        if (msg.consultationId === currentUserId) {
          console.log('Condition 1: consultationId matches (OK)');

          // AI 메시지 또는 다른 사용자(스태프) 메시지인 경우에만 처리
          // AI의 senderId는 'aiChatBot'이므로 currentUserId와 다름
          if (msg.senderId !== currentUserId) {
            console.log(
              'Condition 2: senderId is DIFFERENT from currentUserId (OK for AI/Staff)'
            );

            // **수정: formattedMsg 정의**
            const formattedMsg = {
              id: msg.id,
              senderId: msg.senderId,
              senderType: msg.senderType,
              content: msg.content,
              sentAt: msg.sentAt ? new Date(msg.sentAt) : new Date(), // sentAt이 Date 객체인지 확인
            };

            setMessages((prev) => {
              const currentIds = prev.map((m) => m.id);
              console.log('Current IDs in state:', currentIds);

              if (
                formattedMsg.id &&
                !currentIds.includes(formattedMsg.id) &&
                formattedMsg.content
              ) {
                console.log(
                  'Condition 3: Message is UNIQUE and has CONTENT (OK)'
                );
                console.log('ADDING MESSAGE TO STATE:', formattedMsg);
                return [...prev, formattedMsg];
              } else {
                console.log(
                  'Condition 3: FAILED. (Duplicate ID or missing content). Msg:',
                  formattedMsg
                );
              }
              return prev;
            });
          } else {
            console.log(
              'Condition 2: FAILED. (Message is from current user, skipping - this should happen for your own questions)'
            );
          }
        } else {
          console.log(
            'Condition 1: FAILED. (consultationId does NOT match currentUserId)'
          );
        }
        console.groupEnd();
      };
      newSocket.on('newMessage', handleNewMessage);

      // --- typingStatus 리스너 등록 ---
      const handleTypingStatus = ({
        isTyping: typingStatus,
        userId: typingUserId,
      }) => {
        if (typingUserId !== currentUserId) {
          setIsTyping(typingStatus);
        }
      };
      newSocket.on('typingStatus', handleTypingStatus);

      socketRef.current = newSocket;
    }

    // --- 2. 초기 데이터 로딩 (REST API) ---
    const fetchMessages = async () => {
      try {
        const url = `http://localhost:3000/consultations/${currentUserId}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${userToken}` },
          withCredentials: true,
        });
        const formattedMessages = (response.data.messages || []).map((msg) => ({
          ...msg,
          sentAt:
            msg.sentAt && msg.sentAt._seconds // Firestore Timestamp 형식 처리
              ? new Date(
                  msg.sentAt._seconds * 1000 +
                    (msg.sentAt._nanoseconds || 0) / 1000000
                )
              : msg.sentAt, // 이미 Date 객체인 경우 그대로 사용
        }));
        setMessages(formattedMessages);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(`상담 기록 없음 (${currentUserId}): 초기 메시지 없음.`);
          setMessages([]);
        } else {
          console.error(
            '초기 메시지 가져오기 오류:',
            error.response?.data || error.message
          );
          if (error.response?.status === 401) {
            setModalMessage('인증 오류: 다시 로그인해주세요.');
            setShowModal(true);
          }
        }
      }
    };

    fetchMessages();

    // --- Cleanup 함수 ---
    return () => {
      if (socketRef.current) {
        // 이벤트 리스너 제거
        socketRef.current.off('newMessage', handleNewMessage);
        socketRef.current.off('typingStatus', handleTypingStatus);
        socketRef.current.off('error');
        socketRef.current.off('connect_error');
        socketRef.current.off('connect');

        // 방 나가기 및 타이핑 상태 초기화
        socketRef.current.emit('leave', currentUserId);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        if (currentUserId && socketRef.current.connected) {
          socketRef.current.emit('typing', {
            consultationId: currentUserId,
            isTyping: false,
            userId: currentUserId,
          });
        }

        // 소켓 연결 해제
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userInfo, userToken, currentUserId]);

  // --- handleChange 함수: 메시지 입력 및 isTyping 로직 ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (!currentUserId || !socketRef.current || !socketRef.current.connected)
      return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socketRef.current.emit('typing', {
      consultationId: currentUserId,
      isTyping: true,
      userId: currentUserId,
    });

    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('typing', {
          consultationId: currentUserId,
          isTyping: false,
          userId: currentUserId,
        });
      }
    }, 1000);
  };

  // --- handleSubmit 함수: 메시지 전송 로직 (사용자 자신의 메시지 즉시 추가) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageContent = formData.question.trim();
    if (!messageContent) return;

    if (!userInfo || !currentUserId || !userToken) {
      setModalMessage('로그인 후 이용 가능합니다.');
      setShowModal(true);
      return;
    }

    // 사용자 자신의 메시지를 즉시 화면에 추가
    const tempMessageId = Date.now().toString();
    const userMessage = {
      id: tempMessageId,
      senderId: currentUserId,
      senderType: 'patient',
      content: messageContent,
      sentAt: new Date(),
      isActive: true,
    };
    setMessages((prev) => [...prev, userMessage]);

    // 입력 필드 초기화
    setFormData({ question: '' });

    // 소켓이 연결되어 있을 때만 메시지를 전송합니다.
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('chatMessage', {
        consultationId: currentUserId,
        senderId: currentUserId,
        senderType: 'patient',
        content: messageContent,
      });
    } else {
      setModalMessage(
        '채팅 서버에 연결되지 않았습니다. 잠시 후 다시 시도해주세요.'
      );
      setShowModal(true);
      // 소켓 연결 실패 시 즉시 추가했던 메시지를 제거하거나 실패 표시할 수 있습니다.
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessageId));
      return;
    }

    // 메시지 전송 후 'typing' 상태를 false로 즉시 전송합니다.
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('typing', {
        consultationId: currentUserId,
        isTyping: false,
        userId: currentUserId,
      });
    }

    // AI 활성 상태라면 AI 응답을 요청합니다.
    if (isAiActive) {
      try {
        const aiUrl = 'http://localhost:3000/consultations/ai';
        await axios.post(
          aiUrl,
          { question: messageContent },
          {
            headers: { Authorization: `Bearer ${userToken}` },
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error(
          'AI 응답 요청 실패:',
          error.response?.data || error.message
        );
        // AI 응답 실패 시 사용자에게 알림 (옵션)
      }
    }
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-200px)] max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">AI 챗봇 상담</h2>
        <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={msg.id || i}
              className={`max-w-[80%] text-sm px-4 py-2 rounded-lg whitespace-pre-wrap ${
                msg.senderType === 'patient'
                  ? 'ml-auto bg-blue-100 text-right'
                  : 'mr-auto bg-gray-100 text-left'
              }`}
            >
              {msg.content}
            </div>
          ))}
          {/* isTyping 표시 UI */}
          {isTyping && (
            <div className="text-gray-500 text-sm italic ml-2">
              상대방이 입력 중입니다...
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            className="flex-1 px-6 py-2 rounded outline-1 -outline-offset-1 bg-BD-WarmBeige outline-BD-CoolGray hover:-outline-offset-2 hover:outline-BD-CharcoalBlack focus:-outline-offset-2 focus:outline-BD-CharcoalBlack duration-300"
            name="question"
            value={formData.question}
            onChange={handleChange}
            placeholder="질문을 입력하세요..."
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 rounded bg-BD-CharcoalBlack text-BD-ElegantGold hover:bg-BD-ElegantGold hover:text-BD-CharcoalBlack duration-300 cursor-pointer"
          >
            전송
          </button>
        </div>
      </div>

      <Modal
        show={showModal}
        setShow={setShowModal}
        activeClick={() => {
          setShowModal(false);
          navigate('/signin');
        }}
      >
        <Title>{modalMessage}</Title>
      </Modal>
    </>
  );
}

export default ChatForm;
