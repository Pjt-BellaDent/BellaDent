import { useLocation } from 'react-router-dom';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import isPropValid from '@emotion/is-prop-valid';

const Wrapper = styled.nav`
  width: 220px;
  background: #f9f9f9;
  padding: 20px;
  border-right: 1px solid #ddd;
`;

const UserInfo = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ccc;
`;

const NavLink = styled(Link, {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'active',
})`
  display: block;
  padding: 10px 14px;
  margin-bottom: 8px;
  border-radius: 6px;
  text-decoration: none;
  color: #333;
  background: ${({ active }) => (active ? '#e6f0ff' : 'transparent')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};

  &:hover {
    background: #f0f0f0;
  }
`;

const menuItems = [
  { path: '/Dashboard/notice', label: '📢 공지사항', roles: ['super_admin', 'manager'] },
  { path: '/Dashboard', label: '📊 대시보드', roles: ['super_admin', 'doctor', 'consultant'] },
  { path: '/Dashboard/waiting', label: '⏳ 대기현황', roles: ['super_admin', 'doctor'] },
  { path: '/Dashboard/reservations', label: '📅 예약 관리', roles: ['super_admin', 'consultant'] },
  { path: '/Dashboard/schedule', label: '📆 의료진 일정', roles: ['super_admin', 'doctor'] },
  { path: '/Dashboard/patients', label: '📋 환자 목록', roles: ['super_admin', 'doctor'] },
  { path: '/Dashboard/chat', label: '💬 AI 채팅/상담', roles: ['super_admin', 'consultant'] },
  { path: '/Dashboard/chat-settings', label: '⚙️ 챗봇 설정', roles: ['super_admin'] },
  { path: '/Dashboard/settings', label: '⚙️ 설정', roles: ['super_admin'] },
];

const Sidebar = ({ role = 'super_admin', name = '홍길동' }) => {
  const location = useLocation();

  return (
    <Wrapper>
      <UserInfo>👤 {name}</UserInfo>
      {menuItems
        .filter(item => item.roles.includes(role))
        .map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            active={location.pathname === item.path}
          >
            {item.label}
          </NavLink>
        ))}
    </Wrapper>
  );
};

export default Sidebar;
