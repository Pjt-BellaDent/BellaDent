import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserInfo } from '../contexts/UserInfoContext.jsx';

const menuItems = [
  {
    path: '/Dashboard',
    label: '대시보드',
    roles: ['admin', 'manager', 'staff'],
  },
  {
    path: '/Dashboard/onsite-register',
    label: '현장접수',
    roles: ['admin', 'manager', 'staff'],
  },
  {
    path: '/Dashboard/waiting-manage',
    label: '대기현황',
    roles: ['admin', 'manager', 'staff'],
  },
  {
    path: '/Dashboard/reservations',
    label: '예약 관리',
    roles: ['admin', 'manager', 'staff'],
  },
  {
    path: '/Dashboard/chatbot',
    label: '채팅',
    roles: ['admin', 'manager', 'staff'],
  },
  {
    path: '/Dashboard/sms',
    label: '문자 발송',
    roles: ['admin', 'manager', 'staff'],
  },
  {
    path: '/Dashboard/patients',
    label: '환자 목록',
    roles: ['admin', 'manager', 'staff'],
  },
  {
    path: '/Dashboard/schedule',
    label: '직원 일정',
    roles: ['admin', 'manager'],
  },
  {
    path: '/Dashboard/reviews-manager',
    label: '후기 관리',
    roles: ['admin', 'manager'],
  },
  {
    path: '/Dashboard/chatbot-settings',
    label: '채팅 설정',
    roles: ['admin', 'manager'],
  },
  { path: '/Dashboard/settings', label: '설정', roles: ['admin'] },
];

// 사용자 역할을 한국어 문자열로 매핑한 객체입니다.
const roleToKorean = {
  admin: '관리자',
  manager: '매니저',
  staff: '직원',
};

// Sidebar 컴포넌트 정의
const Sidebar = ({ role = 'admin', name = '홍길동', onOpenNotice }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsLogin, signOutUser } = useUserInfo();
  const [open, setOpen] = useState(false);

  // handleLogout: 로그아웃 처리 함수
  const handleLogout = async () => {
    setIsLogin(false);
    await signOutUser(); // 사용자 정보 초기화
    navigate('/');
  };

  // --- 반응형 사이드바 구조 ---

  // 햄버거 버튼 (모바일/태블릿에서만 표시)
  const Hamburger = !open && (
    <button
      className="fixed top-4 left-4 z-50 flex flex-col justify-center items-center w-11 h-11 rounded-lg bg-transparent hover:bg-BD-PureWhite transition-colors border border-BD-SoftGrayLine lg:hidden group"
      onClick={() => setOpen(true)}
      aria-label="메뉴 열기"
    >
      <span className="block w-7 h-1 rounded bg-BD-CharcoalBlack mb-1 group-hover:bg-BD-ElegantGold transition-colors"></span>
      <span className="block w-7 h-1 rounded bg-BD-CharcoalBlack mb-1 group-hover:bg-BD-ElegantGold transition-colors"></span>
      <span className="block w-7 h-1 rounded bg-BD-CharcoalBlack group-hover:bg-BD-ElegantGold transition-colors"></span>
    </button>
  );

  // 오버레이 사이드바 (모바일/태블릿 환경)
  const OverlaySidebar = (
    // 이 div가 전체 화면을 덮는 반투명 오버레이 역할을 합니다.
    <div
      className={`fixed inset-0 z-40 bg-black/40 flex lg:hidden ${
        open ? '' : 'hidden'
      }`}
      // 오버레이 자체를 클릭하면 사이드바가 닫히도록 설정합니다.
      onClick={() => setOpen(false)}
    >
      {/* 실제 사이드바 메뉴 영역 (오버레이 안에 포함) */}
      <nav
        className="w-[220px] bg-BD-WarmBeige border-r border-BD-SoftGrayLine p-5 text-sm h-full shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 사이드바 닫기 버튼 */}
        <button
          className="absolute top-3 right-3 text-BD-CharcoalBlack hover:text-BD-CharcoalBlack text-2xl"
          onClick={() => setOpen(false)} // 클릭 시 open 상태를 false로 변경하여 사이드바 닫기
          aria-label="메뉴 닫기" // 접근성을 위한 라벨
        >
          × {/* 닫기 아이콘으로 '×' 문자 사용 */}
        </button>

        {/* 사용자 정보 섹션 (이름, 역할, 로그아웃) */}
        <div className="flex flex-col mb-6 pb-3 border-b border-BD-SoftGrayLine text-BD-CharcoalBlack">
          {/* 이름 및 역할 */}
          <div className="font-bold text-base">
            {name} {/* 이름 표시 */}
            {/* 역할 표시 (한국어 매핑 사용) */}
            <span className="ml-2 text-xs text-BD-CoolGray font-normal">
              {roleToKorean[role]}
            </span>
          </div>
          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className="mt-2 text-sm text-BD-DangerRed hover:text-BD-DangerRedDark text-left"
          >
            로그아웃
          </button>
        </div>

        {/* 직원 공지사항 버튼 (admin 또는 manager 역할에게만 표시) */}
        {(role === 'admin' || role === 'manager') && (
          <button
            onClick={onOpenNotice} // 클릭 시 부모 컴포넌트에서 전달받은 공지사항 모달 열기 핸들러 호출
            className="mb-4 text-BD-CharcoalBlack hover:text-BD-ElegantGold hover:font-semibold block text-left"
          >
            공지사항
          </button>
        )}

        {/* 메뉴 목록 */}
        <div className="space-y-1">
          {menuItems
            .filter((item) => item.roles.includes(role))
            .map((item) => {
              const isActive = location.pathname
                .toLowerCase()
                .startsWith(item.path.toLowerCase());
              return (
                // Link 컴포넌트 사용 (페이지 이동 시 전체 새로고침 방지)
                <Link
                  key={item.path} // 고유 key 속성
                  to={item.path} // 이동할 경로
                  className={`block px-4 py-2 rounded hover:bg-BD-PureWhite ${
                    isActive
                      ? 'bg-BD-PureWhite font-semibold text-BD-CharcoalBlack'
                      : 'text-BD-CharcoalBlack'
                  }`}
                  onClick={() => setOpen(false)} // 메뉴 항목 클릭 시 오버레이 사이드바 닫기
                >
                  {item.label} {/* 메뉴 항목 라벨 표시 */}
                </Link>
              );
            })}
        </div>
      </nav>
    </div>
  );

  // 데스크탑 사이드바 (데스크탑 환경에서 항상 표시)
  const DesktopSidebar = (
    <nav className="w-[220px] bg-BD-WarmBeige border-r border-BD-SoftGrayLine p-5 text-sm h-full hidden lg:block">
      {/* 사용자 정보 섹션 (오버레이 사이드바와 동일한 구조와 스타일) */}
      <div className="flex flex-col mb-6 pb-3 border-b border-BD-SoftGrayLine text-BD-CharcoalBlack">
        <div className="font-bold text-base">
          {name}
          <span className="ml-2 text-xs text-BD-CoolGray font-normal">
            {roleToKorean[role]}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 text-sm text-BD-DangerRed hover:text-BD-DangerRedDark text-left"
        >
          로그아웃
        </button>
      </div>
      {/* 직원 공지사항 버튼 (오버레이 사이드바와 동일한 구조와 스타일) */}
      {(role === 'admin' || role === 'manager') && (
        <button
          onClick={onOpenNotice}
          className="mb-4 text-BD-CharcoalBlack hover:text-BD-ElegantGold hover:font-semibold block text-left"
        >
          공지사항
        </button>
      )}
      {/* 메뉴 목록 (오버레이 사이드바와 동일한 구조와 스타일) */}
      <div className="space-y-1">
        {menuItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const isActive = location.pathname
              .toLowerCase()
              .startsWith(item.path.toLowerCase());
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded hover:bg-BD-PureWhite ${
                  isActive
                    ? 'bg-BD-PureWhite font-semibold text-BD-CharcoalBlack'
                    : 'text-BD-CharcoalBlack'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
      </div>
    </nav>
  );

  // 컴포넌트 최종 렌더링 부분
  return (
    <>
      {' '}
      {/* React Fragment를 사용하여 여러 요소를 그룹화합니다. */}
      {Hamburger} {/* 햄버거 버튼 렌더링 (모바일에서만 보임) */}
      {OverlaySidebar} {/* 오버레이 사이드바 렌더링 (모바일에서만 보임) */}
      {DesktopSidebar} {/* 데스크탑 사이드바 렌더링 (데스크탑에서만 보임) */}
    </>
  );
};

export default Sidebar;
