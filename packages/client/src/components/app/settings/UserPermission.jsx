import React, { useState } from 'react';

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
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">👥 사용자 권한 관리</h2>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <select
            className="border rounded px-3 py-2"
            value={filterKey}
            onChange={e => setFilterKey(e.target.value)}
          >
            <option>전체</option>
            <option value="name">이름</option>
            <option value="phone">연락처</option>
            <option value="email">email</option>
            <option value="role">권한</option>
          </select>
          <input
            className="border rounded px-3 py-2"
            placeholder="검색어 입력"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            setFormMode('추가');
            setFormData({ name: '', role: '', email: '', phone: '' });
            setShowForm(true);
          }}
        >
          + 사용자 추가
        </button>
      </div>

      <div className="overflow-y-auto border rounded max-h-80">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="p-3 border">이름</th>
              <th className="p-3 border">이메일</th>
              <th className="p-3 border">연락처</th>
              <th className="p-3 border">권한</th>
              <th className="p-3 border">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr key={idx} className="text-center">
                <td className="p-3 border">{user.name}</td>
                <td className="p-3 border">{user.email}</td>
                <td className="p-3 border">{user.phone}</td>
                <td className="p-3 border">{user.role}</td>
                <td className="p-3 border">
                  <button
                    className="px-2 py-1 text-white bg-blue-500 rounded mr-1"
                    onClick={() => handleEdit(user)}
                  >수정</button>
                  <button
                    className="px-2 py-1 text-white bg-red-500 rounded"
                    onClick={() => handleDelete(user)}
                  >삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="mt-6 p-6 bg-gray-100 border rounded">
          <h4 className="text-lg font-semibold mb-4">👤 사용자 {formMode}</h4>
          <div className="grid gap-4">
            <input
              placeholder="이름"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              placeholder="이메일"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              placeholder="연락처"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <select
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className="border rounded px-3 py-2"
            >
              <option value="">권한 선택</option>
              <option value="super_admin">관리자</option>
              <option value="consultant">상담사</option>
              <option value="doctor">의사</option>
              <option value="manager">실장</option>
            </select>
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                저장
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPermission;
