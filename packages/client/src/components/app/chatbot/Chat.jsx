import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useUserInfo } from '../../../contexts/UserInfoContext.jsx';
import { getAuth } from 'firebase/auth'; // auth 인스턴스 사용 여부에 따라 유지/제거
import io from 'socket.io-client';

const Chat = () => {
  // --- 상태 관리 ---
  const { userInfo, userToken } = useUserInfo(); // 사용자 정보와 토큰
  const [inputText, setInputText] = useState(''); // 메시지 입력 필드
  const [activeUser, setActiveUser] = useState(null); // 현재 활성화된 상담방 ID (고객 UID)
  const [userList, setUserList] = useState([]); // 미답변/담당 상담 목록
  const [chatData, setChatData] = useState({}); // 상담방별 메시지 데이터 { consultationId: [msg1, msg2, ...]}
  const [isTyping, setIsTyping] = useState(false); // 상대방의 타이핑 상태

  const staffUid = userInfo?.id; // 현재 로그인한 스태프의 UID (firebase auth uid와 동일)

  // --- Ref 관리 (컴포넌트 렌더링에 영향 없이 값 유지) ---
  const typingTimeoutRef = useRef(null); // 타이핑 디바운싱 타이머
  const socketRef = useRef(null); // Socket.IO 클라이언트 인스턴스
  const prevActiveUserRef = useRef(null); // cleanup 시점에 사용될 이전 activeUser ID
  const capturedAuthInfoRef = useRef({ token: null, uid: null }); // cleanup 시점에 사용될 인증 정보 캡처

  // 현재 활성 상담방의 메시지 배열 (상태에서 파생)
  const messages = activeUser ? chatData[activeUser] || [] : [];

  // --- API 호출 함수들 (useCallback으로 메모이제이션하여 불필요한 재생성 방지) ---
  const fetchConsultations = useCallback(async () => {
    if (!userToken) {
      console.log('fetchConsultations: userToken이 없어 요청을 건너뜁니다.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/consultations/`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Cache-Control': 'no-cache', // 서버 캐시 무력화
          Pragma: 'no-cache',
          Expires: '0',
        },
        withCredentials: true,
      });
      const allConsultations = response.data.consultations;
      // 'pending' 상태이거나 현재 스태프가 담당하는 상담만 필터링
      const filteredConsultations = allConsultations.filter(
        (c) => c.status === 'pending' || c.handlerId === staffUid
      );
      setUserList(filteredConsultations);

      // 현재 활성 상담이 더 이상 목록에 없으면 activeUser 초기화 (예: 다른 직원이 담당하거나 상담 완료)
      if (
        activeUser &&
        !filteredConsultations.some((c) => c.id === activeUser)
      ) {
        setActiveUser(null);
      }
    } catch (error) {
      console.error(
        '상담 목록을 가져오는 데 실패했습니다:',
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.error('인증 실패: 다시 로그인해주세요.');
      }
    }
  }, [userToken, activeUser, staffUid]);

  /**
   * 특정 상담방의 초기 메시지들을 가져오는 함수
   */
  const fetchInitialMessages = useCallback(async () => {
    if (!activeUser || !userToken) {
      console.warn(
        'fetchInitialMessages: activeUser 또는 userToken이 없어 메시지 요청을 건너뜁니다.'
      );
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/consultations/${activeUser}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Cache-Control': 'no-cache', // 메시지 캐시 무력화
            Pragma: 'no-cache',
            Expires: '0',
          },
          withCredentials: true,
        }
      );
      const messages = response.data.messages;

      // Firestore Timestamp를 JS Date 객체로 변환
      const formattedMessages = messages.map((msg) => ({
        ...msg,
        content: msg.message || msg.content || '', // 메시지 내용 필드 통일
        sentAt:
          msg.sentAt && typeof msg.sentAt._seconds === 'number'
            ? new Date(
                msg.sentAt._seconds * 1000 +
                  (msg.sentAt._nanoseconds || 0) / 1000000
              )
            : msg.sentAt,
      }));
      setChatData((prev) => ({ ...prev, [activeUser]: formattedMessages }));
      console.log(
        `[Chat] 상담 ${activeUser}의 메시지 로드 완료.`,
        formattedMessages
      );
    } catch (error) {
      console.error(
        `상담 ${activeUser}의 초기 메시지를 가져오는 데 실패했습니다:`,
        error.response?.data || error.message
      );
      setChatData((prev) => ({ ...prev, [activeUser]: [] })); // 에러 시 빈 배열로 설정
    }
  }, [activeUser, userToken]);

  /**
   * Socket.IO로부터 상담 목록 업데이트 이벤트를 받았을 때 호출되는 핸들러
   */
  const handleConsultationListUpdate = useCallback(() => {
    console.log('[Chat] 상담 목록 업데이트 이벤트 수신! 목록 새로고침.');
    fetchConsultations();
  }, [fetchConsultations]);

  // --- useEffects (컴포넌트 라이프사이클 및 상태 변화에 따른 동작) ---

  // Effect 1: Socket.IO 클라이언트 초기화 및 연결 관리
  useEffect(() => {
    const currentToken = userToken;
    const currentStaffUid = staffUid;

    if (!currentToken || !currentStaffUid) {
      console.log('[Chat] UserToken 또는 StaffUID 없어 소켓 연결 건너뜀.');
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    if (!socketRef.current) {
      console.log('[Chat] 새로운 Socket.IO 연결을 초기화합니다...');
      const newSocket = io('http://localhost:3000', {
        withCredentials: true,
        auth: { token: currentToken },
      });

      newSocket.on('connect', () =>
        console.log('[Chat] Socket 연결 성공!', newSocket.id)
      );
      newSocket.on('connect_error', (err) =>
        console.error('[Chat] Socket 연결 오류:', err.message)
      );
      newSocket.on('error', (err) => console.error('[Chat] Socket 오류:', err));
      newSocket.on('consultationListUpdated', handleConsultationListUpdate);

      socketRef.current = newSocket;
    }

    fetchConsultations(); // 컴포넌트 마운트 시 초기 상담 목록 가져오기

    // Cleanup: 컴포넌트 언마운트 시 Socket.IO 연결 정리
    return () => {
      if (socketRef.current) {
        console.log('[Chat] 컴포넌트 언마운트 시 Socket.IO 연결을 해제합니다.');
        socketRef.current.off(
          'consultationListUpdated',
          handleConsultationListUpdate
        );
        socketRef.current.off('connect');
        socketRef.current.off('connect_error');
        socketRef.current.off('error');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userToken, staffUid, fetchConsultations, handleConsultationListUpdate]);

  // Effect 2: activeUser의 변화를 감지하고, 이전 activeUser가 사라질 때 담당자 해제 요청
  useEffect(() => {
    // 이펙트 실행 시 현재 activeUser, userToken, staffUid를 캡처
    const currentActiveUserForEffect = activeUser;
    const currentTokenForEffect = userToken;
    const currentStaffUidForEffect = staffUid;

    // Cleanup: activeUser가 변경되거나 컴포넌트 언마운트될 때 담당자 해제 로직 실행
    return () => {
      console.log('[CLEANUP_RELEASE_EFFECT] <<< 클린업 함수 진입 >>>'); // 클린업 실행 확인 로그

      const userToRelease = currentActiveUserForEffect; // 클린업 등록 시점의 activeUser 값

      // 클린업 시점의 캡처된 인증 정보 사용 (userToken, staffUid)
      // 이펙트 의존성에서 userToken, staffUid를 제거했으므로, 여기서 이 값들을 캡처합니다.
      const { token: cleanupToken, uid: cleanupStaffUid } =
        capturedAuthInfoRef.current;

      console.log(`[CLEANUP_RELEASE_EFFECT] 이전 activeUser: ${userToRelease}`);
      console.log(
        `[CLEANUP_RELEASE_EFFECT] 토큰: ${!!cleanupToken}, UID: ${!!cleanupStaffUid}`
      );

      // 담당자 해제 요청: 이전 activeUser가 유효하고, 인증 정보도 유효할 때만 실행
      if (userToRelease && cleanupStaffUid && cleanupToken) {
        console.log(
          `[CLEANUP_RELEASE_EFFECT] 담당자 해제 요청 시작: POST /consultations/handler/${userToRelease}`
        );
        axios
          .post(
            `http://localhost:3000/consultations/handler/${userToRelease}`,
            { handlerId: null },
            {
              headers: { Authorization: `Bearer ${cleanupToken}` },
              withCredentials: true,
            }
          )
          .then((response) => {
            console.log(
              `[CLEANUP_RELEASE_EFFECT] 담당자 해제 성공 응답: ${userToRelease}`,
              response.data
            );
            fetchConsultations(); // 해제 후 상담 목록 새로고침
          })
          .catch((error) => {
            console.error(
              `[CLEANUP_RELEASE_EFFECT] 담당자 해제 실패 응답: ${userToRelease}`,
              error.response?.data || error.message
            );
          });
      } else {
        console.log(
          `[CLEANUP_RELEASE_EFFECT] 담당자 해제 요청 건너뜀 (조건 불충족): userToRelease=${userToRelease}, staffUid=${cleanupStaffUid}, userToken=${!!cleanupToken}`
        );
      }
    };
  }, [activeUser, userToken, staffUid, fetchConsultations]); // userToken, staffUid는 캡처되지만, 의존성으로 유지하여 클린업 함수를 재등록

  // Effect 3: 활성 상담방 메시지 로드 및 실시간 채팅 로직
  useEffect(() => {
    // 캡처된 인증 정보 저장 (소켓 리스너에서 사용)
    capturedAuthInfoRef.current = { token: userToken, uid: staffUid };

    // activeUser가 없으면 채팅방 내용 초기화 및 로직 건너뛰기
    if (!activeUser) {
      setChatData({});
      setIsTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      return;
    }

    // activeUser가 유효하면 초기 메시지 로드
    fetchInitialMessages();

    // Socket.IO 방 조인 및 메시지/타이핑 리스너 등록
    if (socketRef.current && socketRef.current.connected) {
      console.log(
        `[Chat] 방 ${activeUser}에 참여합니다. (소켓 ID: ${socketRef.current.id})`
      );
      socketRef.current.emit('join', activeUser);

      // 새 메시지 수신 핸들러
      // Chat.jsx - handleNewMessage 함수 내부
      const handleNewMessage = (msg) => {
        // 1. 해당 상담방 메시지인지 확인 (기존 로직)
        if (msg.consultationId === activeUser) {
          // 2. 자기 자신이 보낸 메시지인지 확인하여 필터링 (새로운 로직)
          // 서버가 자신의 메시지도 브로드캐스트하기 때문에, 클라이언트에서 즉시 추가된 메시지와 중복될 수 있습니다.
          // staffUid는 현재 로그인한 스태프의 UID입니다.
          if (msg.senderId === staffUid) {
            console.log(
              '[Chat] Socket: 자신의 메시지이므로 중복 추가 방지. 스킵.'
            );
            return; // 자기 자신이 보낸 메시지는 처리하지 않고 스킵
          }

          setChatData((prev) => {
            console.log('[Chat] 새로운 소켓 메시지 처리 중:', msg);
            const currentMessages = prev[activeUser] || [];

            // 3. 중복 메시지 방지 (ID 기준) - 이 로직은 유지
            if (
              currentMessages.some((existingMsg) => existingMsg.id === msg.id)
            ) {
              console.log(
                '[Chat] Socket: 이미 존재하는 메시지 ID이므로 중복 추가 방지. 스킵.'
              );
              return prev;
            }

            // 메시지 추가
            return {
              ...prev,
              [activeUser]: [
                ...currentMessages,
                { ...msg, content: msg.message || msg.content },
              ],
            };
          });
          console.log('[Chat] 새로운 소켓 메시지 처리 완료:', msg);
        }
      };
      socketRef.current.on('newMessage', handleNewMessage);

      // 타이핑 상태 수신 핸들러
      const handleTypingStatus = ({
        isTyping: typingStatus,
        userId: typingUserId,
      }) => {
        if (typingUserId !== staffUid) {
          // 내 타이핑은 제외
          setIsTyping(typingStatus);
        }
      };
      socketRef.current.on('typingStatus', handleTypingStatus);

      // Cleanup: 소켓 리스너 해제 및 방 나가기
      return () => {
        console.log('[CHAT_LOGIC_EFFECT] 클린업 실행: 소켓 리스너 해제');
        if (socketRef.current) {
          socketRef.current.off('newMessage', handleNewMessage);
          socketRef.current.off('typingStatus', handleTypingStatus);
          const userToLeave = prevActiveUserRef.current; // 클린업 등록 시점의 activeUser 값
          if (userToLeave && socketRef.current.connected) {
            console.log(
              `[CHAT_LOGIC_EFFECT] Socket leave 이벤트 전송: ${userToLeave}`
            );
            socketRef.current.emit('leave', userToLeave);
          }
        }
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      };
    }
    // 소켓이 연결되지 않았을 때는 메시지 로드 외 추가 동작 없음
    return () => {}; // 이펙트가 소켓 리스너를 등록하지 않았다면 빈 클린업 함수 반환
  }, [activeUser, userToken, staffUid, fetchInitialMessages]); // 의존성: 이 이펙트 본문이 사용하는 상태

  // --- 이벤트 핸들러 함수들 ---

  /**
   * 메시지 입력 필드 변경 핸들러 (타이핑 상태 전송 포함)
   */
  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (
      !activeUser ||
      !staffUid ||
      !socketRef.current ||
      !socketRef.current.connected
    )
      return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    socketRef.current.emit('typing', {
      consultationId: activeUser,
      isTyping: true,
      userId: staffUid,
    });

    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('typing', {
          consultationId: activeUser,
          isTyping: false,
          userId: staffUid,
        });
      }
    }, 1000);
  };

  // Chat.jsx - sendMessage 함수
  const sendMessage = async () => {
    const text = inputText.trim();
    if (
      !text ||
      !activeUser ||
      !staffUid ||
      !userToken ||
      !socketRef.current ||
      !socketRef.current.connected
    ) {
      console.warn(
        '[Chat] 메시지를 보낼 수 없습니다: 필수 정보 누락 또는 소켓 연결 없음.'
      );
      return;
    }

    // 메시지 전송 중 중복 입력/클릭 방지
    setInputText(''); // 입력 필드를 즉시 초기화 (중요)
    // disabled 상태를 추가하여 전송 완료 전까지 입력 방지 가능 (선택 사항)
    // setSendingMessage(true); // 새로운 상태를 추가하여 <input>과 <button>의 disabled 속성에 연결

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

    // 타이핑 상태 즉시 해제 (서버 요청 전)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('typing', {
        consultationId: activeUser,
        isTyping: false,
        userId: staffUid,
      });
    }

    try {
      const url = `http://localhost:3000/consultations/staff/${activeUser}`;
      await axios.post(
        url,
        { answer: text },
        {
          headers: { Authorization: `Bearer ${userToken}` },
          withCredentials: true,
        }
      );

      // 성공 후 추가 작업
      fetchConsultations(); // 상담 목록 새로고침 (필요시)
    } catch (error) {
      console.error(
        '[Chat] 메시지 전송에 실패했습니다:',
        error.response?.data || error.message
      );
      setChatData((prev) => ({
        ...prev,
        [activeUser]: (prev[activeUser] || []).filter(
          (msg) => msg.id !== tempMessageId
        ),
      }));
    } finally {
      // setSendingMessage(false); // 전송 완료 후 다시 활성화
    }
  };

  /**
   * 상담 목록 클릭 핸들러 (상담방 진입 및 담당자 지정)
   */
  const handleChatClick = async (consultationId) => {
    setActiveUser(consultationId); // activeUser 상태 설정

    if (!staffUid || !userToken) {
      console.warn(
        '[Chat] 직원 UID 또는 토큰이 없어 상담 담당자를 설정할 수 없습니다.'
      );
      return;
    }

    try {
      const url = `http://localhost:3000/consultations/handler/${consultationId}`;
      await axios.post(
        url,
        { handlerId: staffUid }, // 본인 UID로 담당자 지정
        {
          headers: { Authorization: `Bearer ${userToken}` },
          withCredentials: true,
        }
      );
      console.log('[Chat] 상담 담당자 지정 성공!');
      fetchConsultations(); // 담당자 지정 후 상담 목록 새로고침
    } catch (error) {
      console.error(
        '[Chat] 상담 담당자 지정 실패:',
        error.response?.data || error.message
      );
    }
  };

  // --- UI 렌더링 ---
  return (
    <div className="flex h-full overflow-hidden">
      {/* 상담 목록 섹션 */}
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
                            ? 'bg-green-100 text-green-800' // 내가 담당중
                            : user.handlerId === 'aiChatBot'
                            ? 'bg-purple-100 text-purple-800' // AI 답변 완료
                            : 'bg-blue-100 text-blue-800' // 다른 직원 대응중
                        }`}
                      >
                        {user.handlerId === staffUid
                          ? '내가 상담중'
                          : user.handlerId === 'aiChatBot'
                          ? 'AI 답변 완료'
                          : `${user.handlerName || '다른 직원'} 대응중`}
                      </span>
                    ) : (
                      <span className="text-bd-cool-gray text-xs">없음</span> // 담당자 없음
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

        {/* 메시지 입력 및 전송 섹션 */}
        <div className="flex p-3 border-t border-bd-soft-gray-line bg-white h-16 box-border flex-shrink-0">
          <input
            type="text"
            className="flex-1 p-2 border border-bd-soft-gray-line rounded-md mr-3 text-bd-charcoal-black focus:outline-none focus:ring-1 focus:ring-bd-elegant-gold"
            placeholder="답변을 입력하세요..."
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              // onKeyDown 대신 onKeyPress 사용 권장 또는 Enter 키 확인 강화
              if (e.key === 'Enter') {
                e.preventDefault(); // 기본 Enter 동작(줄 바꿈 등) 방지
                sendMessage();
              }
            }}
            // onKeyDown={(e) => e.key === 'Enter' && sendMessage()} // <-- 이 라인을 onKeyPress로 변경했으면 삭제
            disabled={!activeUser}
          />
          <button
            onClick={sendMessage} // <-- 이 버튼 클릭은 그대로 둠
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
