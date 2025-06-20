import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useUserInfo } from '../../../contexts/UserInfoContext.jsx';
import { getAuth } from 'firebase/auth';

import io from 'socket.io-client'; // Socket.IO 클라이언트 라이브러리 임포트

// --- 문제의 원인: 전역 스코프에 socket 인스턴스를 선언하는 이 코드를 삭제합니다. ---
// const socket = io('http://localhost:3000', {
//   withCredentials: true,
// });

const Chat = () => {
  const { userInfo, userToken } = useUserInfo(); // 사용자 정보와 토큰
  const [inputText, setInputText] = useState('');
  const [activeUser, setActiveUser] = useState(null); // 현재 활성화된 상담방 ID
  const [userList, setUserList] = useState([]); // 상담 목록
  const [chatData, setChatData] = useState({}); // 상담별 메시지 데이터
  const [isTyping, setIsTyping] = useState(false); // 상대방의 타이핑 상태
  const auth = getAuth(); // Firebase Auth 인스턴스

  const staffUid = userInfo?.id; // 현재 로그인한 스태프의 UID

  const typingTimeoutRef = useRef(null); // 타이핑 디바운싱을 위한 ref
  const socketRef = useRef(null); // Socket.IO 인스턴스를 useRef로 관리합니다.

  const messages = activeUser ? chatData[activeUser] || [] : []; // 현재 상담방 메시지

  // --- 함수 정의: 컴포넌트 렌더링 스코프에 정의하여 여러 useEffect에서 접근 가능하게 함 ---

  // 상담 목록 가져오기 함수 (useCallback으로 메모이제이션)
  const fetchConsultations = useCallback(async () => {
    if (!userToken) return; // userToken 없으면 요청 안 함 (로그인 전)

    try {
      const url = `http://localhost:3000/consultations/`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`, // 인증 토큰 포함
        },
        withCredentials: true,
      });
      const allConsultations = response.data.consultations;
      // 'pending' 상태의 상담만 필터링하여 미답변 상담 목록으로 표시
      const pendingConsultations = allConsultations.filter(
        (c) => c.status === 'pending'
      );
      setUserList(pendingConsultations);

      // 현재 활성화된 상담이 더 이상 'pending' 목록에 없으면 activeUser 초기화
      if (activeUser && !pendingConsultations.some((c) => c.id === activeUser)) {
        setActiveUser(null);
      }
    } catch (error) {
      console.error('상담 목록을 가져오는 데 실패했습니다:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        console.error('인증 실패: 다시 로그인해주세요.');
        // 필요하다면 로그인 페이지로 리다이렉트하거나 모달을 표시하는 로직을 여기에 추가할 수 있습니다.
      }
    }
  }, [userToken, activeUser]); // userToken과 activeUser가 변경될 때마다 함수를 다시 생성

  // 활성 상담방의 초기 메시지 가져오기 함수 (useCallback으로 메모이제이션)
  const fetchInitialMessages = useCallback(async () => {
    if (!activeUser || !userToken) return; // activeUser나 userToken 없으면 요청 안 함

    try {
      const url = `http://localhost:3000/consultations/${activeUser}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`, // 인증 토큰 포함
        },
        withCredentials: true,
      });
      const messages = response.data.messages;

      // Firestore Timestamp 객체를 JavaScript Date 객체로 변환
      const formattedMessages = messages.map((msg) => ({
        ...msg,
        content: msg.message || msg.content || '',
        sentAt:
          msg.sentAt && typeof msg.sentAt._seconds === 'number'
            ? new Date(
                msg.sentAt._seconds * 1000 +
                  (msg.sentAt._nanoseconds || 0) / 1000000
              )
            : msg.sentAt,
      }));
      setChatData((prev) => ({ ...prev, [activeUser]: formattedMessages }));
    } catch (error) {
      console.error(
        `상담 ${activeUser}의 초기 메시지를 가져오는 데 실패했습니다:`,
        error.response?.data || error.message
      );
      setChatData((prev) => ({ ...prev, [activeUser]: [] })); // 에러 시 빈 배열로 설정
    }
  }, [activeUser, userToken]); // activeUser, userToken이 변경될 때마다 함수 재생성

  // --- 1. Socket.IO 클라이언트 초기화 및 연결 관리 ---
  // 이 useEffect는 컴포넌트 마운트 시 한 번, 또는 userToken/staffUid가 변경될 때 실행됩니다.
  useEffect(() => {
    // userToken과 staffUid가 모두 유효할 때만 소켓 연결을 시도합니다.
    if (!userToken || !staffUid) {
        console.log("Chat.jsx: UserToken 또는 StaffUID가 없습니다. 소켓 연결을 건너뜝니다.");
        // 토큰이 없으면 기존 소켓 연결이 있다면 해제 (중요)
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        return;
    }

    // socketRef.current가 null일 때만 (즉, 최초 연결 시도 시) 소켓 인스턴스를 생성합니다.
    if (!socketRef.current) {
      console.log("Chat.jsx: 새로운 Socket.IO 연결을 초기화합니다...");
      const newSocket = io('http://localhost:3000', {
        withCredentials: true,
        auth: {
          token: userToken, // <-- userToken을 auth 옵션으로 전달
        },
      });

      newSocket.on('connect', () => {
        console.log('Chat.jsx: Socket 연결 성공!', newSocket.id);
        // 연결 성공 시, activeUser가 아직 설정되지 않았을 수 있으므로 특정 방에 바로 join하지는 않습니다.
        // 방 조인은 아래 두 번째 useEffect에서 activeUser가 설정된 후에 관리됩니다.
      });

      newSocket.on('connect_error', (err) => {
        console.error('Chat.jsx: Socket 연결 오류:', err.message);
        // 연결 실패 시 사용자에게 알림을 주거나, 다시 로그인하라는 메시지를 표시할 수 있습니다.
      });

      newSocket.on('error', (err) => { // 일반적인 소켓 에러 리스너
        console.error('Chat.jsx: Socket 오류:', err);
      });

      // 상담 목록 업데이트 리스너를 이 소켓 인스턴스에 등록합니다.
      const handleConsultationListUpdate = () => {
        console.log('상담 목록 업데이트 이벤트 수신! 목록 새로고침.');
        fetchConsultations(); // 상담 목록 새로고침 함수 호출
      };
      newSocket.on('consultationListUpdated', handleConsultationListUpdate);

      socketRef.current = newSocket; // 생성된 소켓 인스턴스를 ref에 저장합니다.
    }

    // 컴포넌트 마운트 시 초기 상담 목록을 가져옵니다.
    fetchConsultations();

    // Cleanup 함수: 컴포넌트 언마운트 시 Socket.IO 연결 정리
    return () => {
      if (socketRef.current) {
        console.log("Chat.jsx: 컴포넌트 언마운트 시 Socket.IO 연결을 해제합니다.");
        socketRef.current.off('consultationListUpdated', handleConsultationListUpdate); // 리스너 해제
        socketRef.current.off('connect');
        socketRef.current.off('connect_error');
        socketRef.current.off('error');
        socketRef.current.disconnect(); // 소켓 연결을 완전히 해제합니다.
        socketRef.current = null; // ref를 초기화합니다.
      }
    };
  }, [userToken, staffUid, fetchConsultations]); // userToken, staffUid, fetchConsultations가 변경될 때마다 실행

  // --- 2. 활성 상담방 메시지 및 실시간 채팅 관련 로직 관리 ---
  // 이 useEffect는 activeUser가 변경될 때마다 실행됩니다.
  useEffect(() => {
    // activeUser, userToken, staffUid, socketRef.current가 모두 유효하고 소켓이 연결되어 있어야 로직을 실행합니다.
    if (!activeUser || !userToken || !staffUid || !socketRef.current || !socketRef.current.connected) {
      // 조건 불충족 시 채팅 데이터 및 타이핑 상태를 초기화합니다.
      setChatData({});
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      return;
    }

    // 활성 상담방의 초기 메시지 가져오기
    fetchInitialMessages();

    // --- Socket.IO 방 조인/나가기 로직 ---
    console.log(`Chat.jsx: 방 ${activeUser}에 참여합니다. (소켓 ID: ${socketRef.current.id})`);
    // 이전 activeUser 방을 명시적으로 떠나고 (만약 이전에 조인된 방이 있다면)
    // 새로운 activeUser 방에 조인합니다.
    socketRef.current.emit('leave', activeUser); // 이전 activeUser 방 나가기
    socketRef.current.emit('join', activeUser); // 새 activeUser 방 참여


    // --- Socket.IO 이벤트 리스너 등록 (activeUser 변경 시마다 재등록) ---
    const handleNewMessage = (msg) => {
      if (msg.consultationId === activeUser) {
        setChatData((prev) => {
          const currentMessages = prev[activeUser] || [];
          if (
            currentMessages.some((existingMsg) => existingMsg.id === msg.id)
          ) {
            return prev;
          }
          return {
            ...prev,
            [activeUser]: [
              ...currentMessages,
              { ...msg, content: msg.message || msg.content },
            ],
          };
        });
      }
    };
    socketRef.current.on('newMessage', handleNewMessage); // 메시지 수신 리스너 등록

    const handleTypingStatus = ({
      isTyping: typingStatus,
      userId: typingUserId,
    }) => {
      if (typingUserId !== staffUid) {
        setIsTyping(typingStatus);
      }
    };
    socketRef.current.on('typingStatus', handleTypingStatus); // 타이핑 상태 리스너 등록

    // --- Cleanup 함수 ---
    return () => {
      // Socket.IO 리스너 해제
      if (socketRef.current) {
        socketRef.current.off('newMessage', handleNewMessage);
        socketRef.current.off('typingStatus', handleTypingStatus);

        // 현재 상담방을 떠날 때 handlerId 해제 요청 (서버 API 호출)
        if (activeUser && staffUid && userToken) {
          const url = `http://localhost:3000/consultations/handler`;
          axios
            .post(
              url,
              {
                consultationId: activeUser,
                handlerId: null, // handlerId를 null로 설정하여 담당 해제
              },
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
                withCredentials: true,
              }
            )
            .catch((error) => console.error('상담 담당자 해제 실패:', error.response?.data || error.message));

          // 타이핑 상태도 해제 (소켓이 연결된 경우에만)
          if (socketRef.current.connected) {
              socketRef.current.emit('typing', {
                consultationId: activeUser,
                isTyping: false,
                userId: staffUid,
              });
          }
        }
        
        // Socket.IO 방 나가기 이벤트 전송 (소켓이 연결된 경우에만)
        if (socketRef.current.connected) {
           socketRef.current.emit('leave', activeUser);
        }
      }

      // 남은 타이핑 타임아웃 클리어
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [activeUser, staffUid, userToken, fetchInitialMessages]); // 모든 의존성 포함

  // 메시지 전송
  const sendMessage = async () => {
    const text = inputText.trim();
    // 필수 조건 검사: 모든 필요한 값이 유효하고 소켓이 연결되어 있어야 함
    if (!text || !activeUser || !staffUid || !userToken || !socketRef.current || !socketRef.current.connected) {
        console.warn("메시지를 보낼 수 없습니다: 필수 정보 누락 또는 소켓 연결 없음.");
        return;
    }

    try {
      const url = `http://localhost:3000/consultations/staff/${activeUser}`;
      await axios.post(
        url,
        {
          answer: text,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          withCredentials: true,
        }
      );

      setInputText(''); // 입력 필드 초기화
      // 메시지 전송 후 타이핑 상태를 즉시 false로 전송
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socketRef.current.emit('typing', {
        consultationId: activeUser,
        isTyping: false,
        userId: staffUid,
      });
    } catch (error) {
      console.error('메시지 전송에 실패했습니다:', error.response?.data || error.message);
    }
  };

  // 텍스트 입력 시 타이핑 상태 업데이트
  const handleInputChange = (e) => {
    setInputText(e.target.value);

    // 필수 조건 검사: activeUser, staffUid 유효하고 소켓이 연결되어 있어야 함
    if (!activeUser || !staffUid || !socketRef.current || !socketRef.current.connected) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socketRef.current.emit('typing', { consultationId: activeUser, isTyping: true, userId: staffUid });

    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('typing', { consultationId: activeUser, isTyping: false, userId: staffUid });
      }
    }, 1000);
  };

  // 상담방 클릭 시 로직: handlerId 지정 (서버 API 호출)
  const handleChatClick = async (consultationId) => {
    setActiveUser(consultationId); // activeUser 상태를 먼저 설정

    if (!staffUid || !userToken) {
      console.warn('직원 UID 또는 토큰이 없어 상담 담당자를 설정할 수 없습니다.');
      return;
    }

    try {
      const url = `http://localhost:3000/consultations/handler`;
      await axios.post(
        url,
        {
          consultationId: consultationId,
          handlerId: staffUid, // 본인 UID로 설정
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          withCredentials: true,
        }
      );
      console.log('상담 담당자 지정 성공!');
      // 서버에서 consultationListUpdated 이벤트를 보낼 것이므로,
      // 그 이벤트를 통해 상담 목록이 자동으로 새로고침될 것입니다.
    } catch (error) {
      console.error('상담 담당자 지정 실패:', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* 상담 목록 */}
      <div className="w-80 bg-bd-pure-white border-r border-bd-soft-gray-line overflow-y-auto">
        <h3 className="p-4 font-bold m-0 text-bd-charcoal-black">
          미답변 상담 목록
        </h3>
        {userList.length === 0 && (
          <div className="p-4 text-bd-cool-gray">
            새로운 미답변 상담이 없습니다.
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-bd-soft-gray-line">
            <thead className="bg-bd-pure-white sticky top-0">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-bd-cool-gray uppercase tracking-wider"
                >
                  고객명
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-bd-cool-gray uppercase tracking-wider"
                >
                  상담 상태
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-bd-cool-gray uppercase tracking-wider"
                >
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
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    {user.handlerId ? (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.handlerId === staffUid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {user.handlerId === staffUid
                          ? '내가 상담중'
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

      {/* 채팅방 */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="bg-white p-4 font-bold border-b border-bd-soft-gray-line text-bd-charcoal-black">
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
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`
                max-w-[60%] p-3 rounded-md my-1 break-words
                ${
                  msg.senderType === 'staff'
                    ? 'self-end bg-bubble-staff'
                    : 'self-start bg-bubble-patient'
                }
              `}
            >
              <span className="text-bd-charcoal-black">{msg.content}</span>
            </div>
          ))}
          {isTyping && (
            <div className="italic text-bd-cool-gray mt-2 ml-3">입력 중...</div>
          )}
        </div>

        <div className="flex p-3 border-t border-bd-soft-gray-line bg-white h-16 box-border flex-shrink-0">
          <input
            type="text"
            className="flex-1 p-2 border border-bd-soft-gray-line rounded-md mr-3 text-bd-charcoal-black focus:outline-none focus:ring-1 focus:ring-bd-elegant-gold"
            placeholder="답변을 입력하세요..."
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={!activeUser}
          />
          <button
            onClick={sendMessage}
            disabled={!activeUser}
            className="
              px-4 py-2 bg-bd-deep-teal text-white font-bold rounded-md
              disabled:bg-bd-cool-gray disabled:cursor-not-allowed
              hover:bg-opacity-90 focus:outline-none focus:ring-1 focus:ring-bd-elegant-gold
            "
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;