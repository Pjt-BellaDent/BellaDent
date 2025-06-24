import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import NoticeModal from '../components/Notice/NoticeModal.jsx';
import { useUserInfo } from '../contexts/UserInfoContext.jsx'

// DashboardFrame 컴포넌트 정의
function DashboardFrame() {
  const { userInfo, isLogin } = useUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
    }
  }, [isLogin, navigate]);

  // --- 공지사항 모달 관련 상태 관리 ---

  // showNotice: 공지사항 메인 모달의 표시/숨김 상태를 관리합니다.
  const [showNotice, setShowNotice] = useState(false);

  // notices: 공지사항 목록 데이터를 저장하는 상태입니다.
  const [notices, setNotices] = useState([
    {
      id: '1',
      title: '병원 정기 점검 안내',
      body: '다음 주 월요일 오전에 시스템 점검이 있습니다.',
      author: '관리자',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      title: '새로운 예약 시스템 사용 방법 교육',
      body: '새로 도입된 예약 시스템 사용 교육 일정을 확인해주세요.',
      author: '김팀장',
      timestamp: new Date().toISOString(),
    },
  ]);

  // title, body: 공지사항 추가/수정 폼의 입력 필드 상태를 관리합니다.
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // showForm: 공지사항 모달 내에서 추가/수정 폼을 표시할지 여부를 관리합니다.
  const [showForm, setShowForm] = useState(false);

  // editingNotice: 현재 수정 중인 공지사항 객체 또는 ID를 저장하는 상태입니다.
  const [editingNotice, setEditingNotice] = useState(null);

  // viewingNotice: 현재 상세 내용을 보고 있는 공지사항 객체를 저장하는 상태입니다.
  const [viewingNotice, setViewingNotice] = useState(null);

  // --- 공지사항 관련 핸들러 함수 ---

  // handleSaveNotice: 공지사항을 추가하거나 수정할 때 호출되는 함수입니다.
  const handleSaveNotice = () => {
    // 제목이 비어있는 경우 경고 메시지 표시
    if (!title.trim()) {
      alert('제목을 입력하세요.');
      return;
    }

    // 저장할 공지사항 데이터 객체를 생성합니다.
    const noticeData = {
      title: title.trim(),
      body: body.trim(),
      // 작성자는 userInfo에서 가져오거나 기본값 설정
      author: userInfo?.name || '알 수 없음',
      // 현재 시간으로 타임스탬프 추가
      timestamp: new Date().toISOString(),
    };

    // editingNotice 상태에 값이 있으면 수정 모드입니다.
    if (editingNotice) {
      setNotices(
        notices.map((notice) =>
          notice.id === editingNotice.id ? { ...notice, ...noticeData } : notice
        )
      );
      console.log('Updated notice:', editingNotice.id, noticeData);
    } else {
      // 새로운 공지사항 객체를 생성합니다.
      const newNotice = { ...noticeData, id: Date.now().toString() };
      // 기존 notices 배열에 새로운 공지사항을 추가합니다.
      setNotices([...notices, newNotice]);
      console.log('Added new notice:', newNotice);
    }

    // 저장 후 폼 관련 상태를 초기화하고 폼을 숨깁니다.
    setTitle('');
    setBody('');
    setEditingNotice(null); // 수정 중 상태 해제
    setShowForm(false); // 폼 숨김
    setViewingNotice(null); // 혹시 열려있을 상세 보기 닫기
  };

  // handleDeleteNotice: 특정 ID의 공지사항을 삭제하는 함수입니다.
  const handleDeleteNotice = (noticeId) => {
    // 삭제 확인 메시지
    if (window.confirm('정말 이 공지사항을 삭제하시겠습니까?')) {
      setNotices(notices.filter((notice) => notice.id !== noticeId));
      console.log('Deleted notice:', noticeId); // 테스트를 위한 로그

      // 만약 삭제된 공지사항이 현재 상세 보기 중이거나 수정 중이었다면 해당 상태를 초기화합니다.
      if (viewingNotice?.id === noticeId) setViewingNotice(null);
      if (editingNotice?.id === noticeId) {
        setTitle('');
        setBody('');
        setEditingNotice(null);
        setShowForm(false);
      }
    }
  };

  // handleEditNotice: 특정 공지사항을 수정하기 위해 폼을 채우고 수정 모드로 전환하는 함수입니다.
  const handleEditNotice = (notice) => {
    setTitle(notice.title); // 수정할 공지사항의 제목으로 폼 채우기
    setBody(notice.body); // 수정할 공지사항의 내용으로 폼 채우기
    setEditingNotice(notice); // 수정 중인 공지사항 상태 설정
    setShowForm(true); // 폼 표시
    setViewingNotice(null); // 혹시 열려있을 상세 보기 닫기
  };

  // handleViewNotice: 특정 공지사항의 상세 내용을 보기 위해 상태를 설정하는 함수입니다.
  const handleViewNotice = (notice) => {
    setViewingNotice(notice); // 상세 보기할 공지사항 상태 설정
    setShowForm(false); // 폼 숨김 (상세 보기 중에는 폼을 볼 필요 없음)
    setEditingNotice(null); // 수정 중 상태 해제
  };

  // --- 컴포넌트 렌더링 ---
  if (!isLogin || !userInfo) {
    // 리디렉션 중이거나 로딩 중일 때 아무것도 렌더링하지 않음
    return null; 
  }

  return (
    <>
      {/* 메인 레이아웃 컨테이너 */}
      <div className="flex min-h-screen">
        {/* Sidebar 컴포넌트 렌더링 */}
        <Sidebar
          role={userInfo.role}
          name={userInfo.name}
          onOpenNotice={() => setShowNotice(true)}
        />
        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 p-6 bg-BD-PureWhite">
          <Outlet />
        </main>

        {/* 공지사항 모달 렌더링 */}
        {showNotice && (
          <NoticeModal
            show={showNotice} // 모달 표시 상태 전달
            onClose={() => {
              // 모달 닫기 핸들러
              setShowNotice(false); // 모달 숨김
              // 모달이 닫힐 때 모든 관련 상태 초기화
              setShowForm(false);
              setTitle('');
              setBody('');
              setEditingNotice(null);
              setViewingNotice(null);
            }}
            // 공지사항 데이터 및 관련 핸들러 전달
            notices={notices} // 공지사항 목록
            title={title} // 폼 제목 상태
            setTitle={setTitle} // 폼 제목 설정 함수
            body={body} // 폼 내용 상태
            setBody={setBody} // 폼 내용 설정 함수
            showForm={showForm} // 폼 표시 상태
            setShowForm={setShowForm} // 폼 표시 상태 설정 함수
            editingNotice={editingNotice} // 수정 중인 공지사항
            setEditingNotice={setEditingNotice} // 수정 중인 공지사항 설정 함수
            viewingNotice={viewingNotice} // 상세 보기 중인 공지사항
            setViewingNotice={setViewingNotice} // 상세 보기 중인 공지사항 설정 함수
            onSave={handleSaveNotice} // 저장 (추가/수정) 핸들러 전달
            onDelete={handleDeleteNotice} // 삭제 핸들러 전달
            onEdit={handleEditNotice} // 수정 시작 핸들러 전달
            onView={handleViewNotice} // 상세 보기 시작 핸들러 전달
          />
        )}
      </div>
    </>
  );
}

export default DashboardFrame;
