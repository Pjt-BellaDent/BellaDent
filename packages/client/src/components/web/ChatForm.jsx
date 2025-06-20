import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../contexts/UserInfoContext.jsx';
import axios from 'axios';
import io from 'socket.io-client';
import Modal from '../web/Modal.jsx';
import Title from '../web/Title.jsx';

// Socket.IO 클라이언트 인스턴스를 전역에서 제거합니다.
// 이제 useEffect 안에서 동적으로 생성됩니다.

function ChatForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ question: '' });
  const [messages, setMessages] = useState([]);
  const { userInfo, userToken } = useUserInfo(); // userInfo와 userToken을 컨텍스트에서 가져옵니다.
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isAiActive, setIsAiActive] = useState(true);
  const [isTyping, setIsTyping] = useState(false); // isTyping 상태
  const typingTimeoutRef = useRef(null); // 타이핑 타임아웃 ID를 저장할 ref

  // Socket.IO 인스턴스를 useRef로 관리합니다.
  const socketRef = useRef(null);

  // 현재 사용자 UID를 userInfo에서 가져옵니다.
  const currentUserId = userInfo?.id;

  useEffect(() => {
    // userInfo와 userToken이 없으면 소켓 연결 및 데이터 가져오기를 건너뜁니다.
    if (!userInfo || !userToken) {
      console.log("UserInfo 또는 UserToken이 아직 없습니다. 소켓 연결 및 데이터 가져오기를 건너뜁니다.");
      return;
    }

    // --- 1. Socket.IO 클라이언트 초기화 및 연결 관리 ---
    // socketRef.current가 null일 때만 (즉, 최초 연결 시도 시) 소켓 인스턴스를 생성합니다.
    if (!socketRef.current) {
      const newSocket = io('http://localhost:3000', {
        withCredentials: true,
        auth: {
          token: userToken, // <-- **이 부분이 핵심입니다!** userToken을 auth 옵션으로 전달합니다.
        },
      });

      newSocket.on('connect', () => {
        console.log('ChatForm에서 Socket 연결됨!', newSocket.id);
        // 연결 성공 시 방 참가
        newSocket.emit('join', currentUserId);
      });

      newSocket.on('connect_error', (err) => {
        console.error('ChatForm에서 Socket 연결 오류:', err.message);
        // 연결 실패 시 사용자에게 모달 메시지 표시
        setModalMessage('채팅 서버 연결 실패: ' + err.message);
        setShowModal(true);
      });

      newSocket.on('error', (err) => { // 일반적인 소켓 에러
        console.error('ChatForm에서 Socket 오류:', err);
      });

      // --- newMessage 리스너 등록 ---
      const handleNewMessage = (msg) => {
        if (msg.consultationId === currentUserId) {
          setMessages(prev => {
            const currentMessages = prev.map(m => m.id); // 현재 메시지 ID 배열
            // ID가 있고 중복이 아니며, content가 유효한 메시지만 추가합니다.
            if (msg.id && !currentMessages.includes(msg.id) && msg.content) {
              const formattedMsg = {
                ...msg,
                // sentAt이 Timestamp 객체일 경우 Date 객체로 변환합니다.
                sentAt: msg.sentAt && msg.sentAt._seconds
                  ? new Date(msg.sentAt._seconds * 1000 + (msg.sentAt._nanoseconds || 0) / 1000000)
                  : msg.sentAt,
              };
              return [...prev, formattedMsg];
            }
            return prev;
          });
        }
      };
      newSocket.on('newMessage', handleNewMessage);

      // --- typingStatus 리스너 등록 (isTyping 기능) ---
      const handleTypingStatus = ({ isTyping: typingStatus, userId: typingUserId }) => {
        // 본인(currentUserId)이 타이핑하는 것은 본인 UI에 표시하지 않습니다.
        if (typingUserId !== currentUserId) {
          setIsTyping(typingStatus);
        }
      };
      newSocket.on('typingStatus', handleTypingStatus);

      socketRef.current = newSocket; // 생성된 소켓 인스턴스를 ref에 저장
    }

    // --- 2. 초기 데이터 로딩 (REST API) ---
    const fetchMessages = async () => {
      try {
        const url = `http://localhost:3000/consultations/${currentUserId}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`, // userToken을 Authorization 헤더에 포함합니다.
          },
          withCredentials: true,
        });
        const formattedMessages = (response.data.messages || []).map(msg => ({
          ...msg,
          // sentAt이 Timestamp 객체일 경우 Date 객체로 변환합니다.
          sentAt: msg.sentAt && msg.sentAt._seconds
            ? new Date(msg.sentAt._seconds * 1000 + (msg.sentAt._nanoseconds || 0) / 1000000)
            : msg.sentAt,
        }));
        setMessages(formattedMessages);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('초기 메시지 가져오기 오류:', error.response?.data || error.message);
          if (error.response?.status === 401) {
            setModalMessage('인증 오류: 다시 로그인해주세요.');
            setShowModal(true);
            // navigate('/signin'); // 로그인 페이지로 리다이렉트
          }
        }
      }
    };

    fetchMessages(); // 초기 메시지 가져오기 호출

    // --- Cleanup 함수 (컴포넌트 언마운트 또는 의존성 변경 시 실행) ---
    return () => {
      if (socketRef.current) {
        // 모든 Socket.IO 리스너를 해제합니다.
        socketRef.current.off('newMessage', handleNewMessage);
        socketRef.current.off('typingStatus', handleTypingStatus);
        socketRef.current.off('error');
        socketRef.current.off('connect_error');
        socketRef.current.off('connect');

        // 서버에 방을 떠났음을 알립니다.
        socketRef.current.emit('leave', currentUserId);

        // 남은 타이핑 타임아웃을 클리어합니다.
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        // 컴포넌트가 언마운트될 때 자신의 타이핑 상태를 false로 서버에 전송합니다.
        if (currentUserId && socketRef.current.connected) {
          socketRef.current.emit('typing', { consultationId: currentUserId, isTyping: false, userId: currentUserId });
        }

        // Socket.IO 연결을 해제합니다.
        socketRef.current.disconnect();
        socketRef.current = null; // ref를 초기화하여 다음 렌더링 시 새 연결을 만들도록 합니다.
      }
    };
  }, [userInfo, userToken, currentUserId]); // userInfo, userToken, currentUserId가 변경될 때마다 useEffect 재실행

  // --- handleChange 함수: 메시지 입력 및 isTyping 로직 ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // currentUserId가 없거나 소켓이 연결되지 않았다면 이벤트를 보내지 않습니다.
    if (!currentUserId || !socketRef.current || !socketRef.current.connected) return;

    // 기존 타이핑 타임아웃을 클리어합니다.
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // 'typing' 이벤트를 서버에 'true'로 보냅니다 (입력 시작).
    socketRef.current.emit('typing', { consultationId: currentUserId, isTyping: true, userId: currentUserId });

    // 1초 동안 추가 입력이 없으면 'false'로 변경하는 타이머를 설정합니다 (디바운스).
    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('typing', { consultationId: currentUserId, isTyping: false, userId: currentUserId });
      }
    }, 1000);
  };

  // --- handleSubmit 함수: 메시지 전송 로직 ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim()) return;

    if (!userInfo || !currentUserId || !userToken) {
      setModalMessage('로그인 후 이용 가능합니다.');
      setShowModal(true);
      return;
    }

    // 소켓이 연결되어 있을 때만 메시지를 전송합니다.
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('chatMessage', {
        consultationId: currentUserId,
        senderId: currentUserId,
        senderType: 'patient', // 환자 클라이언트이므로 senderType은 'patient'
        content: formData.question.trim(),
      });
    } else {
      setModalMessage('채팅 서버에 연결되지 않았습니다. 잠시 후 다시 시도해주세요.');
      setShowModal(true);
      return;
    }

    // 메시지 전송 후 'typing' 상태를 false로 즉시 전송합니다.
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('typing', { consultationId: currentUserId, isTyping: false, userId: currentUserId });
    }

    // AI 활성 상태라면 AI 응답을 요청합니다.
    if (isAiActive) {
      try {
        const aiUrl = 'http://localhost:3000/consultations/ai';
        await axios.post(
          aiUrl,
          { question: formData.question },
          {
            headers: { Authorization: `Bearer ${userToken}` },
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error('AI 응답 요청 실패:', error.response?.data || error.message);
      }
    }

    setFormData({ question: '' }); // 입력 필드 초기화
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-200px)] max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">AI 챗봇 상담</h2>
        <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={msg.id || i} // 메시지 ID가 있다면 사용, 없으면 인덱스 사용
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
            onChange={handleChange} // 수정된 handleChange 적용
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