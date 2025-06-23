import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../contexts/UserInfoContext.jsx';
import axios from 'axios';
import io from 'socket.io-client';
import Modal from '../web/Modal.jsx';
import Title from '../web/Title.jsx';
import React from 'react';

function ChatForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ question: '' });
  const [messages, setMessages] = useState([]);
  const { userInfo, userToken } = useUserInfo();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'success', 'error'

  const socketRef = useRef(null);
  const currentUserId = userInfo?.id;
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleNewMessage = useCallback(
    (msg) => {
      if (
        msg.consultationId === currentUserId &&
        msg.senderId !== currentUserId
      ) {
        const formattedMsg = {
          id: msg.id,
          senderId: msg.senderId,
          senderType: msg.senderType,
          content: msg.content,
          sentAt: msg.sentAt ? new Date(msg.sentAt) : new Date(),
          isActive: msg.isActive !== undefined ? msg.isActive : true,
        };

        setMessages((prev) => {
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
    },
    [currentUserId]
  );

  useEffect(() => {
    if (!userInfo || !userToken) {
      console.log(
        'ChatForm: 사용자 정보 또는 토큰이 없어 소켓 연결 및 데이터 가져오기 건너뜜.'
      );
      return;
    }

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

      newSocket.on('newMessage', handleNewMessage);

      socketRef.current = newSocket;
    }

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
            msg.sentAt && msg.sentAt._seconds
              ? new Date(
                  msg.sentAt._seconds * 1000 +
                    (msg.sentAt._nanoseconds || 0) / 1000000
                )
              : msg.sentAt
              ? new Date(msg.sentAt)
              : new Date(),
          isActive: msg.isActive !== undefined ? msg.isActive : true,
        }));
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

    return () => {
      if (socketRef.current) {
        socketRef.current.off('newMessage', handleNewMessage);
        socketRef.current.off('error');
        socketRef.current.off('connect_error');
        socketRef.current.off('connect');
        socketRef.current.emit('leave', currentUserId);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userInfo, userToken, currentUserId, navigate, handleNewMessage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageContent = formData.question.trim();
    if (!messageContent) return;

    // 모달 초기화
    setShowModal(false);
    setModalMessage('');
    setModalType('');

    if (!userInfo || !currentUserId || !userToken) {
      setModalType('error');
      setModalMessage('로그인 후 이용 가능합니다.');
      setShowModal(true);
      return;
    }

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

    setFormData({ question: '' });

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('chatMessage', {
        consultationId: currentUserId,
        senderId: currentUserId,
        senderType: 'patient',
        content: messageContent,
      });
    } else {
      setModalType('error');
      setModalMessage(
        '채팅 서버에 연결되지 않았습니다. 잠시 후 다시 시도해주세요.'
      );
      setShowModal(true);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessageId));
      return;
    }

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
        // AI 응답 요청 실패 시 사용자에게 알림
        setModalType('error');
        setModalMessage('AI 응답 요청에 실패했습니다.');
        setShowModal(true);
      }
    }
  };

  let lastDate = '';

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-200px)] max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">AI 챗봇 상담</h2>
        <div className="flex-1 overflow-y-auto bg-[#e9edf5] rounded-lg shadow p-4 flex flex-col">
          {messages.map((msg, idx) => {
            const messageDate = msg.sentAt
              ? new Date(msg.sentAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : '';

            let dateSeparator = null;
            if (
              idx === 0 ||
              (messageDate &&
                messageDate !==
                  messages?.[idx - 1]?.sentAt?.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }))
            ) {
              dateSeparator = (
                <div key={`date-${messageDate}`} className="text-center my-4">
                  <span className="inline-block bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {messageDate}
                  </span>
                </div>
              );
            }

            return (
              <React.Fragment key={msg.id || idx}>
                {dateSeparator}
                <div
                  className={`
                    max-w-[80%] my-1 break-words relative flex flex-col
                    ${
                      msg.senderType === 'patient'
                        ? 'self-end items-end'
                        : 'self-start items-start'
                    }
                  `}
                >
                  <div
                    className={`
                      p-3 rounded-xl
                      ${
                        msg.senderType === 'patient'
                          ? 'bg-blue-200 text-gray-800'
                          : msg.senderType === 'ai'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    `}
                  >
                    <span className="text-bd-charcoal-black">
                      {msg.content}
                    </span>
                  </div>
                  <div
                    className={`
                      text-xs text-gray-500 mt-1 mx-2
                      ${
                        msg.senderType === 'patient'
                          ? 'text-right'
                          : 'text-left'
                      }
                    `}
                  >
                    {msg.sentAt
                      ? new Date(msg.sentAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
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

      {showModal && ( // showModal이 true일 때만 렌더링
        <Modal
          show={showModal}
          setShow={setShowModal}
          activeClick={() => {
            setShowModal(false);
            if (modalType === 'error') {
              navigate('/signin'); // 오류 시 로그인 페이지로 이동
            }
            // success 타입은 모달만 닫도록
          }}
        >
          <Title>{modalMessage}</Title>
        </Modal>
      )}
    </>
  );
}

export default ChatForm;
