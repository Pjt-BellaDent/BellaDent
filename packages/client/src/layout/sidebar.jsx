import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserInfo } from '../contexts/UserInfoContext.jsx';

const menuItems = [
  { path: '/Dashboard', label: '📊 대시보드', roles: ['admin', 'manager', 'staff'] },
  { path: '/Dashboard/waiting-manage', label: '⏳ 대기현황', roles: ['admin', 'staff'] },
  { path: '/Dashboard/reservations', label: '📅 예약 관리', roles: ['admin', 'manager', 'staff'] },
  { path: '/Dashboard/schedule', label: '📆 직원 일정', roles: ['admin', 'staff'] },
  { path: '/Dashboard/patients', label: '📋 환자 목록', roles: ['admin', 'staff'] },
  { path: '/Dashboard/chatbot', label: '💬 채팅', roles: ['admin', 'manager', 'staff'] },
  { path: '/Dashboard/chatbot-settings', label: '⚙️ 채팅 설정', roles: ['admin', 'manager', 'staff'] },
  { path: '/Dashboard/reviews-manager', label: '📝 후기', roles: ['admin', 'manager'] },
  { path: '/Dashboard/sms', label: '📱 문자 발송', roles: ['admin', 'staff'] },
  { path: '/Dashboard/settings', label: '⚙️ 설정', roles: ['admin'] },
];

const roleToKorean = {
  'admin': '관리자',
  'manager': '매니저',
  'staff': '직원'
};

const Sidebar = ({ role = 'admin', name = '홍길동', onOpenNotice }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsLogin } = useUserInfo();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setIsLogin(false);
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  // 햄버거 버튼
  const Hamburger = (
    !open && (
      <button
        className="fixed top-4 left-4 z-50 flex flex-col justify-center items-center w-11 h-11 rounded-lg bg-transparent hover:bg-blue-100 transition-colors border border-gray-200 lg:hidden group"
        onClick={() => setOpen(true)}
        aria-label="메뉴 열기"
      >
        <span className="block w-7 h-1 rounded bg-gray-400 mb-1 group-hover:bg-blue-500 transition-colors"></span>
        <span className="block w-7 h-1 rounded bg-gray-400 mb-1 group-hover:bg-blue-500 transition-colors"></span>
        <span className="block w-7 h-1 rounded bg-gray-400 group-hover:bg-blue-500 transition-colors"></span>
      </button>
    )
  );

  // 오버레이 사이드바 (모바일/태블릿)
  const OverlaySidebar = (
    <div className={`fixed inset-0 z-40 bg-black/40 flex lg:hidden ${open ? '' : 'hidden'}`} onClick={() => setOpen(false)}>
      <nav
        className="w-[220px] bg-gray-50 border-r border-gray-200 p-5 text-sm h-full shadow-xl relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={() => setOpen(false)}
          aria-label="메뉴 닫기"
        >
          ×
        </button>
        <div className="flex flex-col mb-6 pb-3 border-b border-gray-300">
          <div className="font-bold text-base">
            👤 {name}
            <span className="ml-2 text-xs text-gray-500 font-normal">{roleToKorean[role]}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-2 text-sm text-red-500 hover:text-red-700 text-left"
          >
            로그아웃
          </button>
        </div>
        {(role === 'admin' || role === 'manager') && (
          <button
            onClick={onOpenNotice}
            className="mb-4 text-blue-600 hover:font-semibold block text-left"
          >📢 직원 공지사항</button>
        )}
        <div className="space-y-1">
          {menuItems
            .filter((item) => item.roles.includes(role))
            .map((item) => {
              const isActive = location.pathname.toLowerCase().startsWith(item.path.toLowerCase());
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-2 rounded hover:bg-gray-100 ${isActive ? 'bg-blue-50 font-semibold text-blue-700' : 'text-gray-800'}`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
        </div>
      </nav>
    </div>
  );

  // 데스크탑 사이드바
  const DesktopSidebar = (
    <nav className="w-[220px] bg-gray-50 border-r border-gray-200 p-5 text-sm h-full hidden lg:block">
      <div className="flex flex-col mb-6 pb-3 border-b border-gray-300">
        <div className="font-bold text-base">
          👤 {name}
          <span className="ml-2 text-xs text-gray-500 font-normal">{roleToKorean[role]}</span>
        </div>
        <button 
          onClick={handleLogout}
          className="mt-2 text-sm text-red-500 hover:text-red-700 text-left"
        >
          로그아웃
        </button>
      </div>
      {(role === 'admin' || role === 'manager') && (
        <button
          onClick={onOpenNotice}
          className="mb-4 text-blue-600 hover:font-semibold block text-left"
        >📢 직원 공지사항</button>
      )}
      <div className="space-y-1">
        {menuItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const isActive = location.pathname.toLowerCase().startsWith(item.path.toLowerCase());
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded hover:bg-gray-100 ${isActive ? 'bg-blue-50 font-semibold text-blue-700' : 'text-gray-800'}`}
              >
                {item.label}
              </Link>
            );
          })}
      </div>
    </nav>
  );

  return (
    <>
      {Hamburger}
      {OverlaySidebar}
      {DesktopSidebar}
    </>
  );
};

export default Sidebar;
