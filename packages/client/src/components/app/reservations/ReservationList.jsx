// ReservationList.jsx (Tailwind 버전)
import React, { useEffect, useState } from 'react';
import ReservationModal from './ReservationModal';
import {
  fetchAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from '../../api/appointments';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getCurrentMonth = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const month = getCurrentMonth();
      const data = await fetchAppointments(month);
      setReservations(data);
      setError('');
    } catch (err) {
      setError('서버 요청 실패');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const filtered = reservations.filter(r => {
    const matchText =
      (r.name && r.name.includes(search)) ||
      (r.department && r.department.includes(search));
    const matchDateRange =
      (!startDate || r.date >= startDate) &&
      (!endDate || r.date <= endDate);

    return matchText && matchDateRange;
  });

  const handleDelete = async (id) => {
    if (!id || typeof id !== 'string') {
      alert('유효하지 않은 예약 ID입니다.');
      return;
    }
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteAppointment(id);
        fetchReservations();
      } catch (err) {
        console.error('삭제 실패:', err);
        alert('삭제 실패: ' + err.message);
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editData?.id) {
        await updateAppointment(editData.id, formData);
      } else {
        await addAppointment(formData);
      }
      fetchReservations();
    } catch (err) {
      console.error('저장 실패:', err);
    } finally {
      setModalOpen(false);
      setEditData(null);
    }
  };

  return (
    <div className="p-8 font-sans">
      <h2 className="text-xl font-bold mb-4">📋 전체 예약 목록</h2>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <label>기간:</label>
          <input
            type="date"
            className="border px-3 py-2 rounded text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>~</span>
          <input
            type="date"
            className="border px-3 py-2 rounded text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <input
            type="text"
            className="border px-3 py-2 rounded text-sm w-[200px]"
            placeholder="이름 또는 진료과 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 text-white rounded px-4 py-2 text-sm font-semibold"
          onClick={() => {
            setEditData(null);
            setModalOpen(true);
          }}
        >
          + 새 예약
        </button>
      </div>

      {loading ? (
        <p>🔄 예약 불러오는 중...</p>
      ) : error ? (
        <p className="text-red-500">⚠️ {error}</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">예약일</th>
              <th className="border px-3 py-2">시간</th>
              <th className="border px-3 py-2">이름</th>
              <th className="border px-3 py-2">생년월일</th>
              <th className="border px-3 py-2">진료과</th>
              <th className="border px-3 py-2">상태</th>
              <th className="border px-3 py-2 text-left">메모</th>
              <th className="border px-3 py-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8" className="text-center py-4">일치하는 예약이 없습니다.</td></tr>
            ) : (
              filtered
                .sort((a, b) => (a.date + (a.startTime || '')).localeCompare(b.date + (b.startTime || '')))
                .map((r, i) => (
                  <tr key={r.id || i}>
                    <td className="border px-3 py-2 text-center">
                      {r.date ? (() => {
                        const [year, month, day] = r.date.split('-');
                        return `${year}년 ${month}월 ${day}일`;
                      })() : '-'}
                    </td>
                    <td className="border px-3 py-2 text-center">{(r.startTime && r.endTime) ? `${r.startTime}~${r.endTime}` : '-'}</td>
                    <td className="border px-3 py-2 text-center">{r.name || '-'}</td>
                    <td className="border px-3 py-2 text-center">{r.birth || '-'}</td>
                    <td className="border px-3 py-2 text-center">{r.department || '-'}</td>
                    <td className="border px-3 py-2 text-center">{r.status || '-'}</td>
                    <td className="border px-3 py-2 text-left">{r.notes || r.memo || '-'}</td>
                    <td className="border px-3 py-2 text-center">
                      <button
                        className="text-sm text-blue-500 hover:underline mr-2"
                        onClick={() => {
                          setEditData(r);
                          setModalOpen(true);
                        }}
                      >수정</button>
                      <button
                        className="text-sm text-red-500 hover:underline"
                        onClick={() => handleDelete(r.id)}
                      >삭제</button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      )}

      <ReservationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSave={handleSave}
        initialData={editData}
      />
    </div>
  );
};

export default ReservationList;
