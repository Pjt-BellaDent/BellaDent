import React, { useState } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 30px;
  font-family: 'Noto Sans KR', sans-serif;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const FilterArea = styled.div`
  display: flex;
  gap: 8px;

  select, input {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
`;

const Button = styled.button`
  padding: 8px 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const TableWrapper = styled.div`
  max-height: 320px;
  overflow-y: auto;
  margin-top: 12px;
  border: 1px solid #eee;
  border-radius: 6px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px;
    border: 1px solid #eee;
    text-align: center;
  }

  th {
    background: #f1f3f5;
    position: sticky;
    top: 0;
    z-index: 1;
  }
`;

const ActionButton = styled.button`
  padding: 4px 10px;
  margin: 0 4px;
  background: ${({ color }) => color || '#007bff'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const OverlayForm = styled.div`
  background: #f8f9fa;
  padding: 24px;
  margin-top: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  gap: 12px;

  input, select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  div.button-group {
    margin-top: 12px;
    display: flex;
    gap: 8px;
  }
`;

const UserPermission = () => {
  const [users, setUsers] = useState([
    { name: '정하늘', role: 'super_admin', email: 'sky@bella.com', phone: '010-1111-2222' },
    { name: '김하나', role: 'consultant', email: 'hana@bella.com', phone: '010-2222-3333' },
    { name: '박진우', role: 'doctor', email: 'jinwoo@bella.com', phone: '010-3333-4444' },
    { name: '이서윤', role: 'manager', email: 'seo@bella.com', phone: '010-4444-5555' },
    { name: '최나영', role: 'consultant', email: 'choi@bella.com', phone: '010-5555-6666' },
    { name: '조민아', role: 'consultant', email: 'jo@bella.com', phone: '010-6666-7777' },
  ]);

  const [filterKey, setFilterKey] = useState('전체');
  const [keyword, setKeyword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('추가');
  const [formData, setFormData] = useState({ name: '', role: '', email: '', phone: '' });

  const filteredUsers = users.filter(user => {
    if (filterKey === '전체') {
      return Object.values(user).some(value => String(value).includes(keyword));
    }
    return String(user[filterKey] || '').includes(keyword);
  });

  const handleEdit = (target) => {
    setFormMode('수정');
    setFormData(target);
    setShowForm(true);
  };

  const handleDelete = (target) => {
    if (window.confirm(`${target.name} 사용자를 삭제하시겠습니까?`)) {
      setUsers(prev => prev.filter(u => u !== target));
    }
  };

  const handleSave = () => {
    if (formMode === '추가') {
      setUsers(prev => [...prev, formData]);
    } else {
      setUsers(prev => prev.map(u => u.name === formData.name ? formData : u));
    }
    setShowForm(false);
    setFormData({ name: '', role: '', email: '', phone: '' });
  };

  return (
    <Container>
      <h2>👥 사용자 권한 관리</h2>
      <TopBar>
        <FilterArea>
          <select value={filterKey} onChange={e => setFilterKey(e.target.value)}>
            <option>전체</option>
            <option value="name">이름</option>
            <option value="phone">연락처</option>
            <option value="email">email</option>
            <option value="role">권한</option>
          </select>
          <input placeholder="검색어 입력" value={keyword} onChange={e => setKeyword(e.target.value)} />
        </FilterArea>
        <Button onClick={() => { setFormMode('추가'); setFormData({ name: '', role: '', email: '', phone: '' }); setShowForm(true); }}>
          + 사용자 추가
        </Button>
      </TopBar>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>이름</th><th>이메일</th><th>연락처</th><th>권한</th><th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr key={idx}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>
                  <ActionButton onClick={() => handleEdit(user)}>수정</ActionButton>
                  <ActionButton color="#dc3545" onClick={() => handleDelete(user)}>삭제</ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      {showForm && (
        <OverlayForm>
          <h4>👤 사용자 {formMode}</h4>
          <input placeholder="이름" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <input placeholder="이메일" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          <input placeholder="연락처" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
            <option value="">권한 선택</option>
            <option value="super_admin">관리자</option>
            <option value="consultant">상담사</option>
            <option value="doctor">의사</option>
            <option value="manager">실장</option>
          </select>
          <div className="button-group">
            <Button onClick={handleSave}>저장</Button>
            <Button style={{ background: '#6c757d' }} onClick={() => setShowForm(false)}>취소</Button>
          </div>
        </OverlayForm>
      )}
    </Container>
  );
};

export default UserPermission;
