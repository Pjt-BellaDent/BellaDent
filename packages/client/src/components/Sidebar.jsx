// Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const SidebarContainer = styled.nav`
  width: 220px;
  background: #f9f9f9;
  padding: 20px;
  border-right: 1px solid #ddd;
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

const MenuItem = styled(Link)`
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

const Sidebar = ({ onOpenNotice }) => {
  return (
    <SidebarContainer>
      <ButtonItem onClick={onOpenNotice}>📢 직원 공지사항</ButtonItem>
      <MenuItem to="/Dashboard">🏠 대시보드</MenuItem>
      <MenuItem to="/Dashboard/waiting">⏳ 진료 대기</MenuItem>
      <MenuItem to="/Dashboard/schedule">📆 의료진 근무 스케줄</MenuItem>
      <MenuItem to="/Dashboard/patients">📋 환자 리스트</MenuItem>
      <MenuItem to="/Dashboard/reservations">📅 예약 관리</MenuItem>
      <MenuItem to="/Dashboard/feedback">📝 후기</MenuItem>
      <MenuItem to="/Dashboard/sms">📱 단체 문자 발송</MenuItem>
      <MenuItem to="/Dashboard/chat">💬 AI 채팅</MenuItem>
      <MenuItem to="/Dashboard/chat-settings">⚙️ AI 채팅 설정</MenuItem>
      <MenuItem to="/Dashboard/settings">⚙️ 전체 설정</MenuItem>
    </SidebarContainer>
  );
};

export default Sidebar;
