// ReservationList.jsx (Tailwind 버전)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReservationModal from './ReservationModal';
import {
  fetchAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from '../../../api/patients';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      if (editData?.appointmentId) {
        await updateAppointment(editData.appointmentId, formData);
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

  // 전체 예약 삭제 함수
  const handleDeleteAll = async () => {
    if (!window.confirm('정말 모든 예약을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    setLoading(true);
    try {
      for (const r of reservations) {
        if (r.appointmentId) await deleteAppointment(r.appointmentId);
        if (r.id) await deleteAppointment(r.id);
      }
      await fetchReservations();
      alert('모든 예약이 삭제되었습니다.');
    } catch (err) {
      alert('일부 예약 삭제에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fafd] font-sans">
      {/* 상단 고정 헤더 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center justify-between px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 rounded px-3 py-1 text-base font-semibold transition"
            onClick={() => navigate('/Dashboard/reservations')}
          >
            <span className="text-2xl">←</span>
            <span className="hidden sm:inline">예약 관리로</span> 돌아가기
          </button>
          <h2 className="text-2xl font-bold ml-2">전체 예약 목록</h2>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-5 py-2 text-base font-semibold shadow transition"
            onClick={handleDeleteAll}
            disabled={loading || reservations.length === 0}
          >
            전체 예약 삭제
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2 text-base font-semibold shadow transition"
            onClick={() => {
              setEditData(null);
              setModalOpen(true);
            }}
          >
            <span className="text-lg font-bold mr-1">＋</span> 새 예약
          </button>
        </div>
      </div>

      {/* 필터/검색 영역 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex flex-wrap gap-2 items-center">
          <label className="text-gray-700 font-medium">기간</label>
          <input
            type="date"
            className="border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-200"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>~</span>
          <input
            type="date"
            className="border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-200"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <input
            type="text"
            className="border px-3 py-2 rounded text-sm w-[180px] focus:ring-2 focus:ring-blue-200"
            placeholder="이름 또는 진료과 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center py-10 text-lg text-blue-600 font-semibold">🔄 예약 불러오는 중...</p>
      ) : error ? (
        <p className="text-center py-10 text-lg text-red-500 font-semibold">⚠️ {error}</p>
      ) : (
        <div className="overflow-x-auto px-2 py-6">
          <table className="min-w-[900px] w-full border-separate border-spacing-0 rounded-lg bg-white shadow text-[15px]">
            <thead>
              <tr className="bg-blue-50 text-blue-700">
                <th className="px-4 py-3 font-semibold border-b border-gray-200">예약일</th>
                <th className="px-4 py-3 font-semibold border-b border-gray-200">시간</th>
                <th className="px-4 py-3 font-semibold border-b border-gray-200">이름</th>
                <th className="px-4 py-3 font-semibold border-b border-gray-200">생년월일</th>
                <th className="px-4 py-3 font-semibold border-b border-gray-200">진료과</th>
                <th className="px-4 py-3 font-semibold border-b border-gray-200">상태</th>
                <th className="px-4 py-3 font-semibold border-b border-gray-200">메모</th>
                <th className="px-4 py-3 font-semibold border-b border-gray-200">관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-8 text-gray-400">일치하는 예약이 없습니다.</td></tr>
              ) : (
                filtered
                  .sort((a, b) => (a.date + (a.startTime || '')).localeCompare(b.date + (b.startTime || '')))
                  .map((r, i) => (
                    <tr key={r.appointmentId || i} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-3 text-center border-b border-gray-100">
                        {r.date ? (() => {
                          const [year, month, day] = r.date.split('-');
                          return `${year}년 ${month}월 ${day}일`;
                        })() : '-'}
                      </td>
                      <td className="px-4 py-3 text-center border-b border-gray-100">{(r.startTime && r.endTime) ? `${r.startTime}~${r.endTime}` : '-'}</td>
                      <td className="px-4 py-3 text-center border-b border-gray-100">{r.name || '-'}</td>
                      <td className="px-4 py-3 text-center border-b border-gray-100">{r.birth || '-'}</td>
                      <td className="px-4 py-3 text-center border-b border-gray-100">{r.department || '-'}</td>
                      <td className="px-4 py-3 text-center border-b border-gray-100">{r.status || '-'}</td>
                      <td className="px-4 py-3 text-left border-b border-gray-100">{r.memo || '-'}</td>
                      <td className="px-4 py-3 text-center border-b border-gray-100">
                        <button
                          className="text-xs bg-yellow-100 text-yellow-800 rounded px-3 py-1 font-semibold mr-2 hover:bg-yellow-200 transition"
                          onClick={() => {
                            setEditData(r);
                            setModalOpen(true);
                          }}
                        >수정</button>
                        <button
                          className="text-xs bg-red-100 text-red-700 rounded px-3 py-1 font-semibold hover:bg-red-200 transition"
                          onClick={() => handleDelete(r.appointmentId)}
                        >삭제</button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
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
