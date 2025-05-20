import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const SidebarContainer = styled.aside`
  width: 200px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  padding: 20px;
`;

const MenuItem = styled(Link)`
  display: block;
  margin-bottom: 15px;
  font-size: 15px;
  color: #007bff;
  text-decoration: none;

  &:hover {
    font-weight: bold;
  }
`;

const Sidebar = () => {
    const menu = [
        { path: '/Dashboard/notice', label: '📢 직원 공지사항' },
        { path: '/Dashboard', label: '🏠 대시보드' },
        { path: '/Dashboard/waiting', label: '⏳ 진료 대기' },
        { path: '/Dashboard/schedule', label: '📆 의료진 근무 스케줄' },
        { path: '/Dashboard/patients', label: '📋 환자 리스트' },
        { path: '/Dashboard/reservations', label: '📅 예약 관리' },
        { path: '/Dashboard/chat', label: '💬 AI 채팅' },
        { path: '/Dashboard/chat-settings', label: '⚙️ AI 채팅 설정' },
        { path: '/Dashboard/settings', label: '⚙️ 전체 설정' },
      ];
      
  return (
    <SidebarContainer>
      <h2>Menu</h2>
      {menu.map(({ path, label }) => (
        <MenuItem key={path} to={path}>{label}</MenuItem>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;
