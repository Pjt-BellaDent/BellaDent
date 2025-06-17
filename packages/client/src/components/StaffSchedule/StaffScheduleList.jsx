import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { fetchSchedulesByMonth, deleteSchedule } from '../../api/scheduleApi';
import SchedulePopup from './SchedulePopup';

const Wrapper = styled.div`
  padding: 30px;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  input {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    width: 200px;
  }

  button {
    background: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    cursor: pointer;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th, td {
    border: 1px solid #eee;
    padding: 10px;
    text-align: center;
  }

  th {
    background: #f1f3f5;
  }

  td.memo {
    text-align: left;
  }

  td.actions {
    button {
      margin: 0 4px;
      font-size: 12px;
    }
  }
`;

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
    <Wrapper>
      <h2>📋 전체 스케줄 목록</h2>
      <Header>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label>기간:</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <span>~</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          <input
            type="text"
            placeholder="이름 또는 직급 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button onClick={() => {
          setEditData(null);
          setModalOpen(true);
        }}>
          + 새 스케줄
        </button>
      </Header>

      {loading ? (
        <p>⏳ 불러오는 중...</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>일자</th>
              <th>시간</th>
              <th>이름</th>
              <th>직급</th>
              <th>메모</th>
              <th>휴무</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7">데이터가 없습니다.</td></tr>
            ) : (
              filtered.map((s, i) => (
                <tr key={s.id || i}>
                  <td>{s.scheduleDate}</td>
                  <td>{s.time || '-'}</td>
                  <td>{s.name || '-'}</td>
                  <td>{s.rank || '-'}</td>
                  <td className="memo">{s.memo || ''}</td>
                  <td>{s.off ? '✅' : '-'}</td>
                  <td className="actions">
                    <button onClick={() => {
                      setEditData(s);
                      setModalOpen(true);
                    }}>수정</button>
                    <button onClick={() => handleDelete(s.id)}>삭제</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
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
    </Wrapper>
  );
};

export default StaffScheduleList;
