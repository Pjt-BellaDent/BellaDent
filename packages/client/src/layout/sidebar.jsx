import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/Dashboard', label: '📊 대시보드', roles: ['admin', 'manager', 'staff'] },
  { path: '/Dashboard/waiting-manage', label: '⏳ 대기현황', roles: ['admin', 'staff'] },
  { path: '/Dashboard/reservations', label: '📅 예약 관리', roles: ['admin', 'manager', 'staff'] },
  { path: '/Dashboard/schedule', label: '📆 직원 일정', roles: ['admin', 'staff'] },
  { path: '/Dashboard/patients', label: '📋 환자 목록', roles: ['admin', 'staff'] },
  { path: '/Dashboard/reviews-manager', label: '📝 후기', roles: ['admin', 'manager'] },
  { path: '/Dashboard/sms', label: '📱 문자 발송', roles: ['admin', 'staff'] },
  { path: '/Dashboard/notice', label: '📢 게시글/공지', roles: ['admin', 'manager'] },
  { path: '/Dashboard/settings', label: '⚙️ 설정', roles: ['admin'] },
];

const Sidebar = ({ role = 'admin', name = '홍길동', onOpenNotice }) => {
  const location = useLocation();

  return (
    <nav className="w-[220px] bg-gray-50 border-r border-gray-200 p-5 text-sm">
      <div className="font-bold text-base mb-6 pb-3 border-b border-gray-300">👤 {name}</div>

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
            const isActive = location.pathname === item.path;
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
};

export default Sidebar;
