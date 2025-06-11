import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import ReservationModal from './ReservationModal';
import {
  fetchAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from '../../api/appointments';

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

  td.notes {
    text-align: left;
  }

  td.actions {
    button {
      margin: 0 4px;
      font-size: 12px;
    }
  }
`;

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
        await createAppointment(formData);
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
    <Wrapper>
      <h2>📋 전체 예약 목록</h2>

      <Header>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label>기간:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="이름 또는 진료과 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button onClick={() => {
          setEditData(null);
          setModalOpen(true);
        }}>
          + 새 예약
        </button>
      </Header>

      {loading ? (
        <p>🔄 예약 불러오는 중...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>⚠️ {error}</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>예약일</th>
              <th>시간</th>
              <th>이름</th>
              <th>생년월일</th>
              <th>진료과</th>
              <th>상태</th>
              <th>메모</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8">일치하는 예약이 없습니다.</td></tr>
            ) : (
              filtered
                .sort((a, b) => (a.date + (a.startTime || '')).localeCompare(b.date + (b.startTime || '')))
                .map((r, i) => (
                  <tr key={r.id || i}>
                    <td>{r.date || '-'}</td>
                    <td>{(r.startTime && r.endTime) ? `${r.startTime}~${r.endTime}` : '-'}</td>
                    <td>{r.name || '-'}</td>
                    <td>{r.birth || '-'}</td>
                    <td>{r.department || '-'}</td>
                    <td>{r.status || '-'}</td>
                    <td className="notes">{r.notes || r.memo || '-'}</td>
                    <td className="actions">
                      <button onClick={() => {
                        setEditData(r);
                        setModalOpen(true);
                      }}>수정</button>
                      <button onClick={() => handleDelete(r.id)}>삭제</button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </Table>
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
    </Wrapper>
  );
};

export default ReservationList;
