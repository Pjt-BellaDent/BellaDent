import React, { useState, useEffect, useRef, useCallback } from 'react'; // <--- 이 부분을 추가하거나 확인해 주세요.
import axiosInstance from '../../../libs/axiosInstance';
import { useUserInfo } from '../../../contexts/UserInfoContext.jsx';
import io from 'socket.io-client';

// 날짜 변환 유틸리티 함수
const formatMessageDate = (sentAt) => {
  if (!sentAt) return new Date();
  if (typeof sentAt._seconds === 'number') {
    return new Date(sentAt._seconds * 1000 + (sentAt._nanoseconds || 0) / 1000000);
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

  // --- 스크롤을 가장 아래로 이동시키는 함수 ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- 메시지가 업데이트될 때마다 스크롤 이동 ---
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- 1. 상담 목록 가져오기 ---
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

  // --- 2. 특정 상담방의 초기 메시지 가져오기 ---
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

  // --- 3. Socket.IO 클라이언트 초기화 및 이벤트 등록 ---
  useEffect(() => {
    if (!userToken || !staffUid) {
      if (socketRef.current) {
        console.warn(
          'Socket: UserToken 또는 StaffUID 없음. 기존 소켓 연결 해제.'
        );
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    if (socketRef.current) {
      console.log('Socket: 이미 연결된 소켓이 있습니다. 재연결 건너뜜.');
      return;
    }

    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      withCredentials: true,
      auth: { token: userToken },
    });

    newSocket.on('connect', () => {
      console.log('Socket 연결됨:', newSocket.id);
    });
    newSocket.on('connect_error', (err) => {
      console.error('Socket 연결 오류:', err.message);
    });
    newSocket.on('error', (err) => {
      console.error('Socket 오류:', err);
    });

    newSocket.on('consultationListUpdated', fetchConsultations);

    newSocket.on('newMessage', (msg) => {
      const currentActiveRoomId = activeUserRef.current;
      const currentStaffId = userInfo?.id;

      if (msg.consultationId === currentActiveRoomId) {
        if (msg.senderId === currentStaffId) return;

        setChatData((prev) => {
          const messagesForCurrentRoom = prev[currentActiveRoomId] || [];
          if (
            messagesForCurrentRoom.some(
              (existingMsg) => existingMsg.id === msg.id
            )
          ) {
            return prev;
          }
          const updatedMessages = [
            ...messagesForCurrentRoom,
            { 
              ...msg, 
              content: msg.message || msg.content || '',
              sentAt: formatMessageDate(msg.sentAt)
            },
          ];
          return { ...prev, [currentActiveRoomId]: updatedMessages };
        });
      }
      fetchConsultations();
    });

    socketRef.current = newSocket;

    return () => {
      if (socketRef.current) {
        console.log(`Socket 연결 해제 요청 (클린업): ${socketRef.current.id}`);
        socketRef.current.off('consultationListUpdated', fetchConsultations);
        socketRef.current.off('newMessage');
        socketRef.current.off('connect');
        socketRef.current.off('connect_error');
        socketRef.current.off('error');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userToken, staffUid, userInfo, fetchConsultations]);

  // --- 4. userToken이 유효할 때 상담 목록 초기 로드 ---
  useEffect(() => {
    if (userToken) {
      fetchConsultations();
    }
  }, [userToken, fetchConsultations]);

  // --- 5. activeUser 변경 시 (방 조인/나가기 및 메시지 로드) ---
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

  // --- 6. 컴포넌트 언마운트 시 또는 activeUser가 명시적으로 null이 될 때의 최종 담당자 해제 ---
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
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          'Development StrictMode: 언마운트 클린업에서 API 호출 건너뜀.'
        );
        return;
      }

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

  // --- 7. 메시지 입력 필드 변경 핸들러 ---
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // --- 8. 메시지 전송 핸들러 ---
  const sendMessage = useCallback(async () => {
    const text = inputText.trim();
    if (
      !text ||
      !activeUser ||
      !staffUid ||
      !userToken ||
      !socketRef.current ||
      !socketRef.current.connected
    ) {
      console.warn('메시지 전송 조건 미달:', {
        text,
        activeUser,
        staffUid,
        userToken,
        socketConnected: socketRef.current?.connected,
      });
      return;
    }

    const tempMessageId = Date.now().toString();
    const staffMessage = {
      id: tempMessageId,
      senderId: staffUid,
      senderType: 'staff',
      content: text,
      sentAt: new Date(),
      isActive: true,
    };

    setChatData((prev) => ({
      ...prev,
      [activeUser]: [...(prev[activeUser] || []), staffMessage],
    }));
    setInputText('');

    try {
      await axiosInstance.post(
        `/consultations/staff/${activeUser}`,
        { answer: text },
        {
          headers: { Authorization: `Bearer ${userToken}` },
          withCredentials: true,
        }
      );
      fetchConsultations();
    } catch (error) {
      console.error('메시지 전송 실패:', error.response?.data || error.message);
      setChatData((prev) => ({
        ...prev,
        [activeUser]: (prev[activeUser] || []).filter(
          (msg) => msg.id !== tempMessageId
        ),
      }));
    }
  }, [activeUser, staffUid, userToken, inputText, fetchConsultations]);

  // --- 9. 상담 목록 클릭 핸들러 (다른 직원 상담중인 경우 접근 차단) ---
  const handleChatClick = useCallback(
    async (consultationId) => {
      if (!staffUid || !userToken) {
        return;
      }

      // 클릭한 상담 정보를 userList에서 찾습니다.
      const clickedConsultation = userList.find((c) => c.id === consultationId);

      // 다른 직원이 담당 중인 상담인지 확인
      // handlerId가 있고 (null이 아니며), 그 handlerId가 현재 직원(staffUid)의 ID와 다르면
      if (
        clickedConsultation &&
        clickedConsultation.handlerId &&
        clickedConsultation.handlerId !== staffUid
      ) {
        // AI 챗봇이 담당 중인 경우는 허용 (필요시 AI 담당방은 들어갈 수 있도록)
        if (clickedConsultation.handlerId === 'aiChatBot') {
          // AI 챗봇 담당방은 들어갈 수 있도록 허용. 단, 여기서는 담당자를 AI에서 나로 변경하는 로직이 필요.
          // 현재는 AI 답변 완료 상태에서 직원이 재상담하는 시나리오가 아닐 수 있으므로,
          // 일단 AI 챗봇 담당방도 다른 직원처럼 접근 차단하거나,
          // 아니면 AI 챗봇 담당방은 자유롭게 들어가서 답변을 이어갈 수 있도록 할 수 있습니다.
          // 일단은 다른 직원처럼 차단하는 방향으로 하겠습니다.
          console.log(
            `[handleChatClick] AI 챗봇이 담당 중인 상담 ${consultationId}입니다. 접근 차단.`
          );
          alert(`AI 챗봇이 답변 중인 상담입니다.`); // 사용자에게 알림
          return;
        }

        console.log(
          `[handleChatClick] 다른 직원이 담당 중인 상담 ${consultationId}입니다. 접근 차단.`
        );
        alert(`다른 직원이 상담 중인 채팅방입니다.`); // 사용자에게 알림
        return; // 접근 차단
      }

      // 이미 활성 상태이거나 같은 상담을 클릭했다면 무시
      if (activeUser === consultationId) {
        console.log(
          `[handleChatClick] 이미 선택된 상담: ${consultationId}. 재선택 무시.`
        );
        return;
      }

      const previousActiveUser = activeUser;

      setActiveUser(consultationId);

      try {
        // 이전 상담 담당자 해제 (내가 담당하고 있었다면)
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

        // 새로운 상담 담당자 지정
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

        await fetchConsultations(); // 최종 상담 목록 새로고침
      } catch (error) {
        console.error(
          `[API Error] 담당자 변경 실패:`,
          error.response?.data || error.message
        );
        setActiveUser(previousActiveUser); // 실패 시 이전 activeUser로 롤백
        await fetchConsultations(); // 목록 새로고침 (UI 원상복구)
      }
    },
    [activeUser, staffUid, userToken, fetchConsultations, userList]
  );

  let lastDate = ''; // 날짜 구분선 표시를 위한 변수 (return 문 내부에서 초기화되어야 함)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 상담 목록 섹션 */}
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
                          user.handlerId === staffUid
                            ? 'bg-green-100 text-green-800'
                            : user.handlerId === 'aiChatBot'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {user.handlerId === staffUid
                          ? '내가 상담중'
                          : user.handlerId === 'aiChatBot'
                          ? 'AI 답변 완료'
                          : `${user.handlerName || '다른 직원'} 대응중`}
                      </span>
                    ) : (
                      <span className="text-bd-cool-gray text-xs">없음</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 채팅방 섹션 */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="bg-white p-4 font-bold border-b border-bd-soft-gray-line text-bd-charcoal-black flex-shrink-0">
          {activeUser
            ? `${
                userList.find((u) => u.id === activeUser)?.name || activeUser
              } 상담 중`
            : '상담 선택 대기 중'}
        </div>

        {/* 메시지 목록 부분: flex-1과 overflow-y-auto로 스크롤 가능하게 합니다. */}
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
                  new Date(messages[idx - 1]?.sentAt).toLocaleDateString('ko-KR', {
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
                {' '}
                {/* key는 React.Fragment에 주는 것이 아니라, 실제 요소에 줘야 합니다. */}
                {dateSeparator}
                <div
                  className={`
                    max-w-[60%] my-1 break-words relative flex flex-col
                    ${
                      msg.senderId === 'AI_Bot' || msg.senderType === 'staff' || msg.senderType === 'ai'
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
                        msg.senderId === 'AI_Bot' || msg.senderType === 'staff' || msg.senderType === 'ai'
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

        {/* 메시지 입력 및 전송 섹션 */}
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
