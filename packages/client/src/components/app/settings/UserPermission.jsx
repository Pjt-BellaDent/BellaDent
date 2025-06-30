import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../libs/axiosInstance.js';

const UserPermission = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterKey, setFilterKey] = useState('전체');
  const [keyword, setKeyword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('추가');
  const [formData, setFormData] = useState({ name: '', role: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);

  // 사용자 목록 조회
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/users/staff');
      setUsers(response.data);
    } catch (err) {
      console.error('사용자 목록 조회 실패:', err);
      setError('사용자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    if (filterKey === '전체') {
      return Object.values(user).some(value => String(value).includes(keyword));
    }
    return String(user[filterKey] || '').includes(keyword);
  });

  const handleEdit = (target) => {
    setFormMode('수정');
    setFormData({
      name: target.name || '',
      role: target.role || '',
      email: target.email || '',
      phone: target.phone || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (target) => {
    if (window.confirm(`${target.name} 사용자를 삭제하시겠습니까?`)) {
      try {
        await axiosInstance.delete(`/users/${target.id}`);
        await fetchUsers(); // 목록 새로고침
      } catch (err) {
        console.error('사용자 삭제 실패:', err);
        alert('사용자 삭제에 실패했습니다.');
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    try {
      setSaving(true);
      
      if (formMode === '추가') {
        await axiosInstance.post('/users/staff', formData);
      } else {
        // 수정 시에는 기존 사용자 ID가 필요하므로, 현재는 새로고침으로 처리
        await axiosInstance.put(`/users/staff/${formData.id}`, formData);
      }
      
      await fetchUsers(); // 목록 새로고침
      setShowForm(false);
      setFormData({ name: '', role: '', email: '', phone: '' });
    } catch (err) {
      console.error('사용자 저장 실패:', err);
      alert('사용자 정보 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">사용자 목록을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

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
              <tr key={user.id || idx} className="text-center">
                <td className="p-3 border">{user.name}</td>
                <td className="p-3 border">{user.email}</td>
                <td className="p-3 border">{user.phone}</td>
                <td className="p-3 border">{user.role}</td>
                <td className="p-3 border">
                  <button
                    className="px-2 py-1 text-white bg-blue-500 rounded mr-1 hover:bg-blue-600"
                    onClick={() => handleEdit(user)}
                  >수정</button>
                  <button
                    className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
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
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                disabled={saving}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400"
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
