import React, { useEffect, useState } from 'react';
import { fetchSchedulesByMonth, deleteSchedule } from '../../api/scheduleApi';
import SchedulePopup from './SchedulePopup';

const StaffScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editData, setEditData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadSchedules = async () => {
    const today = new Date();
    const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    setLoading(true);
    try {
      const data = await fetchSchedulesByMonth(month);
      setSchedules(data || []);
    } catch (e) {
      console.error('불러오기 오류:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await deleteSchedule(id);
    loadSchedules();
  };

  const filtered = schedules.filter((s) => {
    const matchText =
      (s.name && s.name.toLowerCase().includes(search.toLowerCase())) ||
      (s.rank && s.rank.includes(search));
    const matchDateRange =
      (!startDate || s.scheduleDate >= startDate) &&
      (!endDate || s.scheduleDate <= endDate);
    return matchText && matchDateRange;
  });

  return (
    <div className="p-6 font-sans">
      <h2 className="text-xl font-bold mb-4">📋 전체 스케줄 목록</h2>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <label>기간:</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border px-3 py-2 rounded text-sm" />
          <span>~</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border px-3 py-2 rounded text-sm" />
          <input
            type="text"
            placeholder="이름 또는 직급 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border px-3 py-2 rounded text-sm w-[200px]"
          />
        </div>
        <button
          onClick={() => {
            setEditData(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          + 새 스케줄
        </button>
      </div>

      {loading ? (
        <p>⏳ 불러오는 중...</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">일자</th>
              <th className="border px-3 py-2">시간</th>
              <th className="border px-3 py-2">이름</th>
              <th className="border px-3 py-2">직급</th>
              <th className="border px-3 py-2 text-left">메모</th>
              <th className="border px-3 py-2">휴무</th>
              <th className="border px-3 py-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-4">데이터가 없습니다.</td></tr>
            ) : (
              filtered.map((s, i) => (
                <tr key={s.id || i}>
                  <td className="border px-3 py-2 text-center">{s.scheduleDate}</td>
                  <td className="border px-3 py-2 text-center">{s.time || '-'}</td>
                  <td className="border px-3 py-2 text-center">{s.name || '-'}</td>
                  <td className="border px-3 py-2 text-center">{s.rank || '-'}</td>
                  <td className="border px-3 py-2 text-left">{s.memo || ''}</td>
                  <td className="border px-3 py-2 text-center">{s.off ? '✅' : '-'}</td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => {
                        setEditData(s);
                        setModalOpen(true);
                      }}
                      className="text-sm text-blue-500 hover:underline mr-2"
                    >수정</button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-sm text-red-500 hover:underline"
                    >삭제</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <SchedulePopup
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditData(null);
          }}
          onSave={() => {
            loadSchedules();
            setModalOpen(false);
            setEditData(null);
          }}
          initialData={editData}
        />
      )}
    </div>
  );
};

export default StaffScheduleList;
