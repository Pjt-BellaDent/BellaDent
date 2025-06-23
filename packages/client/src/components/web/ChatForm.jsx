import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../contexts/UserInfoContext.jsx';
import axiosInstance from '../../libs/axiosInstance';
import io from 'socket.io-client';
import Modal from '../web/Modal.jsx';
import React from 'react';

// Firestore Timestamp를 JS Date 객체로 변환하고 유효성을 검사하는 함수
const formatMessageDate = sentAt => {
  if (!sentAt) return new Date(); // null이나 undefined인 경우 현재 시간 반환
  // Firestore Timestamp 객체 형식인 경우
  if (typeof sentAt.seconds === "number" && typeof sentAt.nanoseconds === "number") {
    return new Date(sentAt.seconds * 1000 + sentAt.nanoseconds / 1000000);
  }
  // 이미 Date 객체이거나 유효한 날짜 문자열인 경우
  const date = new Date(sentAt);
  if (!isNaN(date.getTime())) {
    return date;
  }
  // 처리할 수 없는 형식인 경우 현재 시간 반환
  return new Date();
};

function ChatForm() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const { userInfo, userToken } = useUserInfo();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const consultationId = userInfo?.id; // consultationId로 명칭 통일

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleNewMessage = useCallback(
    msg => {
      // 메시지 객체와 consultationId 유효성 검사
      if (msg && msg.consultationId === consultationId) {
        setMessages(prev => {
          // id를 기준으로 중복 메시지 방지
          const isDuplicate = prev.some(m => m.id === msg.id);
          if (isDuplicate) return prev;
          // 새 메시지를 추가하고 시간 순으로 정렬
          const newMessages = [...prev, { ...msg, sentAt: formatMessageDate(msg.sentAt) }];
          return newMessages.sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());
        });
      }
    },
    [consultationId]
  );

  useEffect(() => {
    if (!userInfo || !userToken || !consultationId) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setMessages([]); // 로그아웃 시 메시지 초기화
      return;
    }

    const newSocket = io(import.meta.env.VITE_API_URL, {
      auth: { token: userToken },
      withCredentials: true,
    });

    socketRef.current = newSocket;

    // 서버에 방 참가를 요청할 때 consultationId를 객체에 담아 전달
    newSocket.on("connect", () => {
      newSocket.emit("join", { consultationId });
    });

    newSocket.on("newMessage", handleNewMessage);
    
    // 에러 핸들링
    newSocket.on("error", (error) => {
      console.error("Socket.IO error:", error);
    });

    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(`/consultations/${consultationId}`);
        const fetchedMessages = response.data.messages || [];
        const formattedMessages = fetchedMessages.map(msg => ({
          ...msg,
          sentAt: formatMessageDate(msg.sentAt),
        }));
        setMessages(formattedMessages.sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime()));
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("초기 메시지 가져오기 오류:", error);
        }
        setMessages([]); // 404 또는 다른 에러 시 메시지 목록 초기화
      }
    };

    fetchMessages();

    return () => {
      if (newSocket) {
        newSocket.emit("leave", { consultationId });
        newSocket.off("connect");
        newSocket.off("newMessage", handleNewMessage);
        newSocket.off("error");
        newSocket.disconnect();
      }
    };
  }, [userInfo, userToken, consultationId, handleNewMessage, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    const messageContent = question.trim();
    if (!messageContent) return;

    if (!userInfo || !consultationId || !userToken) {
      setModalType("error");
      setModalMessage("로그인 후 이용 가능합니다.");
      setShowModal(true);
      return;
    }
    
    const tempMessageId = `temp_${Date.now()}`;
    // 사용자 메시지 낙관적 업데이트
    const userMessage = {
      id: tempMessageId,
      consultationId: consultationId,
      senderId: consultationId,
      senderType: "patient",
      content: messageContent,
      sentAt: new Date(),
    };
    setMessages(prev => [...prev, userMessage].sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime()));
    setQuestion(""); // 질문 전송 후 입력창 비우기

    try {
      // 서버에 메시지 전송 (Socket.IO)
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("chatMessage", {
          consultationId: consultationId,
          content: messageContent,
        });
      }

      // AI 응답 요청 (HTTP)
      await axiosInstance.post("/ai", {
        message: messageContent,
        consultationId: consultationId,
      });

    } catch (error) {
      console.error("메시지 전송 또는 AI 응답 요청 실패:", error);
      // 실패 시 낙관적 업데이트된 메시지 제거
      setMessages(prev => prev.filter(msg => msg.id !== tempMessageId));
      setModalType("error");
      setModalMessage("메시지 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-200px)] max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4 text-center">AI 챗봇 상담</h2>
        <div className="flex-1 overflow-y-auto bg-gray-100 rounded-lg shadow-inner p-4 flex flex-col space-y-4">
          {messages.map((msg, idx) => {
            const isUserMessage = msg.senderType === "patient";

            // 날짜 구분선 로직
            let dateSeparator = null;
            if (idx === 0) {
              dateSeparator = formatMessageDate(msg.sentAt).toLocaleDateString("ko-KR");
            } else {
              const prevMsgDate = formatMessageDate(messages[idx-1].sentAt).toLocaleDateString("ko-KR");
              const currentMsgDate = formatMessageDate(msg.sentAt).toLocaleDateString("ko-KR");
              if (prevMsgDate !== currentMsgDate) {
                dateSeparator = currentMsgDate;
              }
            }

            return (
              <React.Fragment key={msg.id || idx}>
                {dateSeparator && (
                  <div className="text-center text-sm text-gray-500 my-2">{dateSeparator}</div>
                )}
                <div
                  className={`flex items-end gap-2 ${
                    isUserMessage ? "self-end flex-row-reverse" : "self-start"
                  }`}
                >
                  <div className={`max-w-[80%] px-4 py-3 rounded-xl break-words ${
                    isUserMessage 
                      ? "bg-blue-500 text-white rounded-br-none" 
                      : "bg-white text-gray-800 rounded-bl-none"
                  }`}>
                    <p className="m-0">{msg.content}</p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatMessageDate(msg.sentAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <form className="flex p-3 border-t border-gray-200 bg-white" onSubmit={handleSubmit}>
          <input
            type="text"
            name="question"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="질문을 입력하세요..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            autoComplete="off"
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e); }}
          />
          <button type="submit" className="ml-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            전송
          </button>
        </form>
      </div>
      {showModal && (
        <Modal
          type={modalType}
          message={modalMessage}
          onClose={() => setShowModal(false)}
          redirectTo={modalType === 'error' && modalMessage.includes('로그인') ? '/login' : undefined}
        />
      )}
    </>
  );
}

export default ChatForm;
