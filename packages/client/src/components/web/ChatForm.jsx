import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../contexts/UserInfoContext.jsx'; // Context 경로 확인
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
  const [isAiActive, setIsAiActive] = useState(false); // AI 활성 상태

  const socketRef = useRef(null);
  const currentUserId = userInfo?.id;

  useEffect(() => {
    // userInfo 또는 userToken이 없으면 소켓 연결 및 데이터 로딩을 건너뜁니다.
    if (!userInfo || !userToken) {
      console.log(
        'ChatForm: 사용자 정보 또는 토큰이 없어 소켓 연결 및 데이터 가져오기 건너뜜.'
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
        // AI 또는 스태프 메시지이며, 현재 사용자가 보낸 메시지가 아닌 경우에만 처리
        // isActive 필드를 고려하여 활성 메시지만 추가하도록 로직 확장 가능
        if (
          msg.consultationId === currentUserId &&
          msg.senderId !== currentUserId
        ) {
          const formattedMsg = {
            id: msg.id,
            senderId: msg.senderId,
            senderType: msg.senderType,
            content: msg.content,
            sentAt: msg.sentAt ? new Date(msg.sentAt) : new Date(), // Date 객체로 변환
            isActive: msg.isActive !== undefined ? msg.isActive : true, // 서버에서 받은 값 사용, 없으면 기본값 true
          };

          setMessages((prev) => {
            // 중복 메시지 방지 및 유효한 내용 확인
            const currentIds = prev.map((m) => m.id);
            if (
              formattedMsg.id &&
              !currentIds.includes(formattedMsg.id) &&
              formattedMsg.content
            ) {
              return [...prev, formattedMsg];
            }
            return prev;
          });
        }
      };
      newSocket.on('newMessage', handleNewMessage);

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
          // Firestore Timestamp 형식을 Date 객체로 변환하거나, 이미 Date 객체인 경우 그대로 사용
          sentAt:
            msg.sentAt && msg.sentAt._seconds
              ? new Date(
                  msg.sentAt._seconds * 1000 +
                    (msg.sentAt._nanoseconds || 0) / 1000000
                )
              : msg.sentAt
              ? new Date(msg.sentAt)
              : new Date(), // 유효한 sentAt 값이 없으면 현재 시간으로
          isActive: msg.isActive !== undefined ? msg.isActive : true, // 서버에서 받은 값 사용, 없으면 기본값 true
        }));
        // 여기서 isActive가 false인 메시지를 필터링하여 UI에 표시하지 않을 수 있습니다.
        // 예를 들면: .filter(msg => msg.isActive)
        setMessages(formattedMessages);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(
            `ChatForm: 상담 기록 없음 (${currentUserId}): 초기 메시지 없음.`
          );
          setMessages([]);
        } else {
          console.error(
            'ChatForm: 초기 메시지 가져오기 오류:',
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
        socketRef.current.off('error');
        socketRef.current.off('connect_error');
        socketRef.current.off('connect');

        // 방 나가기
        socketRef.current.emit('leave', currentUserId);

        // 소켓 연결 해제
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userInfo, userToken, currentUserId, navigate]);

  // --- handleChange 함수: 메시지 입력만 처리 ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      isActive: true, // isActive 필드 다시 추가
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
        // 서버 전송 시 isActive 필드도 함께 보낼 수 있습니다. (백엔드 설계에 따라)
        // isActive: true,
      });
    } else {
      setModalMessage(
        '채팅 서버에 연결되지 않았습니다. 잠시 후 다시 시도해주세요.'
      );
      setShowModal(true);
      // 메시지 전송 실패 시, 추가했던 임시 메시지 제거
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessageId));
      return;
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
          'ChatForm: AI 응답 요청 실패:',
          error.response?.data || error.message
        );
        // AI 응답 요청 실패 시 사용자에게 알림 또는 재시도 로직 추가 고려
      }
    }
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-200px)] max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">AI 챗봇 상담</h2>
        <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow p-4 space-y-3">
          {/* isActive가 false인 메시지는 여기서 필터링하여 렌더링하지 않을 수 있습니다. */}
          {messages
            // .filter(msg => msg.isActive) // 만약 비활성 메시지를 표시하지 않으려면 이 필터를 추가하세요.
            .map((msg, i) => (
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
