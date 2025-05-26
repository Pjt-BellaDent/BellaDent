import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import ReservationModal from './ReservationModal';

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

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const monthParam = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

      const res = await fetch(`http://localhost:3000/test/appointments?month=${monthParam}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setReservations(data);
        setError('');
      } else {
        setError(data?.error || '데이터 형식 오류');
        setReservations([]);
      }
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

  const filtered = reservations.filter(r =>
    (r.name && r.name.toLowerCase().includes(search.toLowerCase())) ||
    (r.department && r.department.includes(search))
  );

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await fetch(`http://localhost:3000/test/appointments/${id}`, {
        method: 'DELETE'
      });
      fetchReservations();
    }
  };

  return (
    <Wrapper>
      <h2>📋 전체 예약 목록</h2>

      <Header>
        <input
          type="text"
          placeholder="이름 또는 진료과 검색"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
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
              <th>진료과</th>
              <th>의사</th>
              <th>메모</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8">일치하는 예약이 없습니다.</td></tr>
            ) : (
              filtered.map((r, i) => (
                <tr key={r.id || i}>
                  <td>{r.reservationDate || '-'}</td>
                  <td>{r.time || '-'}</td>
                  <td>{r.name || '-'}</td>
                  <td>{r.department || '-'}</td>
                  <td>{r.doctor || '-'}</td>
                  <td className="memo">{r.memo || ''}</td>
                  <td>{r.status || '-'}</td>
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

      {modalOpen && (
        <ReservationModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditData(null);
          }}
          onSave={() => {
            setModalOpen(false);
            setEditData(null);
            fetchReservations();
          }}
          initialData={editData}
        />
      )}
    </Wrapper>
  );
};

export default ReservationList;
