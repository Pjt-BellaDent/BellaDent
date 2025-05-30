// ReservationManager.jsx — 예약 시간 UX 개선, ReservationModal과 연동
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import CalendarGrid from './CalendarGrid';
import ReservationDetail from './ReservationDetail';
import ReservationModal from './ReservationModal';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 30px;
`;

const ReservationManager = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDept, setSelectedDept] = useState('전체');
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [events, setEvents] = useState({});
  const navigate = useNavigate();

  const getMonthStr = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(`http://localhost:3000/appointments?month=${getMonthStr(currentDate)}`);
      const data = await res.json();
      const grouped = {};
      data.forEach(item => {
        if (!grouped[item.reservationDate]) grouped[item.reservationDate] = [];
        grouped[item.reservationDate].push(item);
      });
      setEvents(grouped);
    } catch (err) {
      console.error("예약 로딩 실패:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const handleSave = async (formData) => {
    try {
      const method = editData?.id ? 'PUT' : 'POST';
      const url = editData?.id ? `http://localhost:3000/appointments/${editData.id}` : `http://localhost:3000/appointments`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(await res.text());
      setModalOpen(false);
      setEditData(null);
      fetchEvents();
    } catch (err) {
      console.error("저장 실패:", err);
    }
  };

  const handleEditClick = (eventData) => {
    setEditData(eventData);
    setModalOpen(true);
    setSelectedDate(eventData.reservationDate); // 수정 시 해당 날짜로 고정
  };

  const handleDelete = async (id) => {
    if (!id || typeof id !== 'string' || id.length < 8) {
      alert('유효하지 않은 예약 ID입니다. 삭제할 수 없습니다.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/appointments/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(await res.text());
      fetchEvents();
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 실패: " + err.message);
    }
  };

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📅 예약 관리</h2>
        <button
          onClick={() => navigate('/Dashboard/reservations/list')}
          style={{ padding: '6px 12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}
        >
          전체 목록
        </button>
      </div>

      <CalendarGrid
        currentDate={currentDate}
        events={events}
        onChangeMonth={changeMonth}
        onSelectDate={setSelectedDate}
        onAdd={() => setModalOpen(true)}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      <ReservationDetail
        date={selectedDate}
        events={events}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      <ReservationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSave={handleSave}
        initialData={editData}
        selectedDate={selectedDate}
        eventsForDate={events[selectedDate] || []} // 예약 시간 중복 체크용
      />
    </Container>
  );
};

export default ReservationManager;
