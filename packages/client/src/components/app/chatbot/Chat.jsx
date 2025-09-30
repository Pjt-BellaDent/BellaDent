// src/components/app/chatbot/Chat.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../../../libs/axiosInstance';
import { useUserInfo } from '../../../contexts/UserInfoContext.jsx';
import io from 'socket.io-client';

const formatMessageDate = (sentAt) => {
  if (!sentAt) return new Date();
  if (typeof sentAt._seconds === 'number') {
    return new Date(
      sentAt._seconds * 1000 + (sentAt._nanoseconds || 0) / 1000000
    );
  }
  return new Date(sentAt);
};

const Chat = () => {
  const { userInfo, userToken } = useUserInfo();
  const [inputText, setInputText] = useState('');
  const [activeUser, setActiveUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [chatData, setChatData] = useState({});

  const staffUid = userInfo?.id;

  const socketRef = useRef(null);
  const activeUserRef = useRef(null);
  const messagesEndRef = useRef(null);

  const messages = activeUser ? chatData[activeUser] || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConsultations = useCallback(async () => {
    if (!userToken) return;
    try {
      const response = await axiosInstance.get('/consultations/', {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
      const allConsultations = response.data.consultations;

      const filteredConsultations = allConsultations.filter(
        (c) => c.status === 'pending' || c.handlerId === staffUid
      );

      const sortedConsultations = filteredConsultations.sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
        const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
        return dateA.getTime() - dateB.getTime();
      });

      setUserList(sortedConsultations);
    } catch (error) {
      console.error('상담 목록 가져오기 오류:', error);
    }
  }, [userToken, staffUid]);

  const fetchInitialMessages = useCallback(async () => {
    if (!activeUser || !userToken) return;
    try {
      const response = await axiosInstance.get(`/consultations/${activeUser}`, {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
      const messages = response.data.messages;
      const formattedMessages = messages.map((msg) => ({
        ...msg,
        content: msg.message || msg.content || '',
        sentAt: formatMessageDate(msg.sentAt),
        isActive: msg.isActive !== undefined ? msg.isActive : true,
      }));
      setChatData((prev) => ({ ...prev, [activeUser]: formattedMessages }));
    } catch (error) {
      console.error(
        `상담방 (${activeUser}) 메시지 가져오기 오류:`,
        error.response?.data || error.message
      );
      setChatData((prev) => ({ ...prev, [activeUser]: [] }));
    }
  }, [activeUser, userToken]);

  useEffect(() => {
    if (!userToken || !staffUid) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    if (socketRef.current) {
      return;
    }

    const socketUrl =
      import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

    const newSocket = io(socketUrl, {
      withCredentials: true,
      auth: { token: userToken },
      path: '/socket.io/',
    });

    newSocket.on('connect', () => {
      console.log('Socket 연결됨 (직원):', newSocket.id);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket 연결 오류:', err.message);
    });

    newSocket.on('newMessage', (msg) => {
      if (msg && msg.consultationId === activeUserRef.current) {
        setChatData((prev) => {
          const currentMessages = prev[msg.consultationId] || [];
          if (currentMessages.some((m) => m.id === msg.id)) {
            return prev;
          }
          return {
            ...prev,
            [msg.consultationId]: [
              ...currentMessages,
              { ...msg, sentAt: formatMessageDate(msg.sentAt) },
            ],
          };
        });
      }
      fetchConsultations();
    });

    newSocket.on('consultationListUpdated', fetchConsultations);

    socketRef.current = newSocket;

    return () => {
      if (newSocket) {
        newSocket.disconnect();
        socketRef.current = null;
      }
    };
  }, [userToken, staffUid, fetchConsultations]);

  useEffect(() => {
    if (userToken) {
      fetchConsultations();
    }
  }, [userToken, fetchConsultations]);

  useEffect(() => {
    activeUserRef.current = activeUser;

    const currentConsultationId = activeUser;

    if (currentConsultationId) {
      fetchInitialMessages();

      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('join', currentConsultationId);
        console.log(
          `[Socket:join] 방 참가 (activeUser 변경): ${currentConsultationId} by ${staffUid}`
        );
      }
    } else {
      setChatData({});
    }

    return () => {
      const userToLeave = activeUserRef.current;
      if (userToLeave && socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('leave', userToLeave);
        console.log(
          `[Socket:leave] 방 나가기 (클린업): ${userToLeave} by ${staffUid}`
        );
      }
    };
  }, [activeUser, fetchInitialMessages, staffUid]);

  useEffect(() => {
    if (activeUser === null) {
      const previousConsultationId = activeUserRef.current;

      if (previousConsultationId && staffUid && userToken) {
        const previousConsultation = userList.find(
          (c) => c.id === previousConsultationId
        );
        if (
          previousConsultation &&
          previousConsultation.handlerId === staffUid
        ) {
          console.log(
            `[API] activeUser null 전환: 상담 ${previousConsultationId} 담당자 해제 요청.`
          );
          axiosInstance
            .post(
              `/consultations/handler/${previousConsultationId}`,
              { handlerId: null },
              {
                headers: { Authorization: `Bearer ${userToken}` },
                withCredentials: true,
              }
            )
            .then(() => {
              console.log(
                `[API] activeUser null 전환: 상담 ${previousConsultationId} 담당자 해제 성공.`
              );
              fetchConsultations();
            })
            .catch((err) => {
              console.error(
                `[API Error] activeUser null 전환: 상담 ${previousConsultationId} 담당자 해제 실패:`,
                err.response?.data || err.message
              );
            });
        }
      }
    }

    return () => {
      const lastActiveUser = activeUserRef.current;
      if (lastActiveUser && staffUid && userToken) {
        const currentConsultation = userList.find(
          (c) => c.id === lastActiveUser
        );
        if (currentConsultation && currentConsultation.handlerId === staffUid) {
          console.log(
            `[API] 컴포넌트 언마운트 클린업: 상담 ${lastActiveUser} 담당자 해제 요청.`
          );
          axiosInstance
            .post(
              `/consultations/handler/${lastActiveUser}`,
              { handlerId: null },
              {
                headers: { Authorization: `Bearer ${userToken}` },
                withCredentials: true,
              }
            )
            .then(() => {
              console.log(
                `[API] 컴포넌트 언마운트 클린업: 상담 ${lastActiveUser} 담당자 해제 성공.`
              );
            })
            .catch((err) => {
              console.error(
                `[API Error] 컴포넌트 언마운트 클린업: 상담 ${lastActiveUser} 담당자 해제 실패:`,
                err.response?.data || err.message
              );
            });
        }
      }
    };
  }, [activeUser, staffUid, userToken, fetchConsultations, userList]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const sendMessage = useCallback(async () => {
    const text = inputText.trim();
    if (!text || !activeUser || !staffUid || !userToken) {
      return;
    }

    if (!socketRef.current || !socketRef.current.connected) {
      alert('연결이 불안정합니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const tempMessage = {
      id: `temp_${Date.now()}`,
      senderId: staffUid,
      senderType: 'staff',
      content: text,
      sentAt: new Date().toISOString(),
      isActive: true,
      consultationId: activeUser,
    };

    setChatData((prev) => ({
      ...prev,
      [activeUser]: [...(prev[activeUser] || []), tempMessage],
    }));

    setInputText('');

    socketRef.current.emit('chatMessage', {
      consultationId: activeUser,
      senderType: 'staff',
      content: text,
    });
  }, [activeUser, staffUid, userToken, inputText]);

  const handleChatClick = useCallback(
    async (consultationId) => {
      if (!staffUid || !userToken) {
        return;
      }

      const clickedConsultation = userList.find((c) => c.id === consultationId);

      if (
        clickedConsultation &&
        clickedConsultation.handlerId &&
        clickedConsultation.handlerId !== staffUid
      ) {
        if (clickedConsultation.handlerId === 'aiChatBot') {
          console.log(
            `[handleChatClick] AI 챗봇이 담당 중인 상담 ${consultationId}입니다. 접근 차단.`
          );
          alert(`AI 챗봇이 답변 중인 상담입니다.`);
          return;
        }

        console.log(
          `[handleChatClick] 다른 직원이 담당 중인 상담 ${consultationId}입니다. 접근 차단.`
        );
        alert(`다른 직원이 상담 중인 채팅방입니다.`);
      }

      if (activeUser === consultationId) {
        console.log(
          `[handleChatClick] 이미 선택된 상담: ${consultationId}. 재선택 무시.`
        );
        return;
      }

      const previousActiveUser = activeUser;

      setActiveUser(consultationId);

      try {
        if (previousActiveUser) {
          const prevConsultation = userList.find(
            (c) => c.id === previousActiveUser
          );
          if (prevConsultation && prevConsultation.handlerId === staffUid) {
            console.log(
              `[API] 클릭: 이전 상담 ${previousActiveUser} 담당자 해제 요청 시작.`
            );
            await axiosInstance.post(
              `/consultations/handler/${previousActiveUser}`,
              { handlerId: null },
              {
                headers: { Authorization: `Bearer ${userToken}` },
                withCredentials: true,
              }
            );
            console.log(
              `[API] 클릭: 이전 상담 ${previousActiveUser} 담당자 해제 성공.`
            );
          }
        }

        console.log(
          `[API] 클릭: 새 상담 ${consultationId} 담당자 설정 요청 시작.`
        );
        await axiosInstance.post(
          `/consultations/handler/${consultationId}`,
          { handlerId: staffUid },
          {
            headers: { Authorization: `Bearer ${userToken}` },
            withCredentials: true,
          }
        );
        console.log(`[API] 클릭: 새 상담 ${consultationId} 담당자 설정 성공.`);

        await fetchConsultations();
      } catch (error) {
        console.error(
          `[API Error] 담당자 변경 실패:`,
          error.response?.data || error.message
        );
        setActiveUser(previousActiveUser);
        await fetchConsultations();
      }
    },
    [activeUser, staffUid, userToken, fetchConsultations, userList]
  );

  let lastDate = '';

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-80 bg-bd-pure-white border-r border-bd-soft-gray-line flex flex-col flex-shrink-0">
        <h3 className="p-4 font-bold m-0 text-bd-charcoal-black flex-shrink-0">
          미답변 상담 목록
        </h3>
        <div className="flex-1 overflow-y-auto">
          {userList.length === 0 && (
            <div className="p-4 text-bd-cool-gray">
              새로운 미답변 상담이 없습니다.
            </div>
          )}
          <table className="min-w-full divide-y divide-bd-soft-gray-line">
            <thead className="bg-bd-pure-white sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-bd-cool-gray uppercase tracking-wider">
                  고객명
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-bd-cool-gray uppercase tracking-wider">
                  상담 상태
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-bd-cool-gray uppercase tracking-wider w-28">
                  담당자
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-bd-soft-gray-line">
              {userList.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => handleChatClick(user.id)}
                  className={`
                    cursor-pointer hover:bg-bd-cancel-gray-hover
                    ${activeUser === user.id ? 'bg-blue-100' : ''}
                  `}
                >
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-bd-charcoal-black">
                    {user.name || user.userId}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-bd-charcoal-black">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      대기중
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm w-28">
                    {user.handlerId ? (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.handlerId === staffUid && activeUser === user.id
                            ? 'bg-green-100 text-green-800'
                            : user.handlerId === 'aiChatBot'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {user.handlerId === staffUid && activeUser === user.id
                          ? '내가 상담중'
                          : user.handlerId === 'aiChatBot'
                          ? 'AI 답변 완료'
                          : `${user.handlerName || '다른 직원'} 대응중`}
                      </span>
                    ) : (
                      <span className="text-bd-cool-gray text-xs">없음</span>
                    )}
                    ,
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="bg-white p-4 font-bold border-b border-bd-soft-gray-line text-bd-charcoal-black flex-shrink-0">
          {activeUser
            ? `${
                userList.find((u) => u.id === activeUser)?.name || activeUser
              } 상담 중`
            : '상담 선택 대기 중'}
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-[#e9edf5] flex flex-col">
          {messages.length === 0 && activeUser && (
            <div className="text-center text-bd-cool-gray mt-10">
              메시지가 없습니다.
            </div>
          )}
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
                  new Date(messages[idx - 1]?.sentAt).toLocaleDateString(
                    'ko-KR',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  ))
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
                    max-w-[60%] my-1 break-words relative flex flex-col
                    ${
                      msg.senderId === 'AI_Bot' ||
                      msg.senderType === 'staff' ||
                      msg.senderType === 'ai'
                        ? 'self-end items-end'
                        : 'self-start items-start'
                    }
                  `}
                >
                  <div
                    className={`
                      p-3 rounded-xl
                      ${
                        msg.senderId === 'AI_Bot' || msg.senderType === 'staff'
                          ? 'bg-yellow-200 text-gray-800'
                          : msg.senderType === 'ai'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-white text-gray-800'
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
                        msg.senderId === 'AI_Bot' ||
                        msg.senderType === 'staff' ||
                        msg.senderType === 'ai'
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

        <div className="flex p-3 border-t border-bd-soft-gray-line bg-white h-16 box-border flex-shrink-0">
          <input
            type="text"
            className="flex-1 px-6 py-2 rounded outline-1 -outline-offset-1 bg-BD-WarmBeige outline-BD-CoolGray hover:-outline-offset-2 hover:outline-BD-CharcoalBlack focus:-outline-offset-2 focus:outline-BD-CharcoalBlack duration-300"
            placeholder="답변을 입력하세요..."
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={!activeUser}
          />
          <button
            onClick={sendMessage}
            disabled={!activeUser}
            className="px-6 py-2 rounded bg-BD-CharcoalBlack text-BD-ElegantGold hover:bg-BD-ElegantGold hover:text-BD-CharcoalBlack duration-300 cursor-pointer"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
