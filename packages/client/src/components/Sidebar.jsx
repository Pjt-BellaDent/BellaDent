import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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

const ButtonItem = styled.button`
  display: block;
  margin-bottom: 15px;
  font-size: 15px;
  color: #007bff;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-align: left;

  &:hover {
    font-weight: bold;
  }
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

// ERD 기준 role 명칭: patient, staff, manager, admin
// menuItems의 roles도 맞게 정리
const menuItems = [
  {
    path: '/Dashboard',
    label: '📊 대시보드',
    roles: ['admin', 'manager', 'staff'],
  },
  {
    path: '/Dashboard/waiting-manage',
    label: '⏳ 대기현황',
    roles: ['admin', 'staff'],
  },
  {
    path: '/Dashboard/reservations',
    label: '📅 예약 관리',
    roles: ['admin', 'manager', 'staff'],
  },
  {
    path: '/Dashboard/schedule',
    label: '📆 직원 일정',
    roles: ['admin', 'staff'],
  },
  {
    path: '/Dashboard/patients',
    label: '📋 환자 목록',
    roles: ['admin', 'staff'],
  },
  {
    path: '/Dashboard/feedback',
    label: '📝 후기',
    roles: ['admin', 'manager'],
  },
  {
    path: '/Dashboard/sms',
    label: '📱 문자 발송',
    roles: ['admin', 'staff'],
  },
  {
    path: '/Dashboard/notice',
    label: '📢 게시글/공지',
    roles: ['admin', 'manager'],
  },
  {
    path: '/Dashboard/settings',
    label: '⚙️ 설정',
    roles: ['admin'],
  },
];

const Sidebar = ({ role = 'admin', name = '홍길동', onOpenNotice }) => {
  const location = useLocation();

  return (
    <Wrapper>
      <UserInfo>👤 {name}</UserInfo>

      {(role === 'admin' || role === 'manager') && (
        <ButtonItem onClick={onOpenNotice}>📢 직원 공지사항</ButtonItem>
      )}

      {menuItems
        .filter((item) => item.roles.includes(role))
        .map((item) => (
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
