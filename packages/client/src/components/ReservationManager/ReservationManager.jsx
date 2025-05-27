import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import CalendarGrid from './CalendarGrid';
import ReservationDetail from './ReservationDetail';
import ReservationModal from './ReservationModal';
import { useNavigate } from 'react-router-dom';

const Container = styled.div` padding: 30px; `;

const ReservationManager = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDept, setSelectedDept] = useState('전체');
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [events, setEvents] = useState({});
  const navigate = useNavigate();

  const getMonthStr = (date) => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    return `${y}-${m.toString().padStart(2, '0')}`;
  };

  const changeMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + delta);
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const fetchAppointments = async () => {
    const month = getMonthStr(currentDate);
    try {
      const res = await fetch(`http://localhost:3000/test/appointments?month=${month}`);
      const data = await res.json();
      const grouped = {};
      data.forEach(item => {
        const { id, reservationDate, userId, department, notes } = item;
        if (!grouped[reservationDate]) grouped[reservationDate] = [];
        grouped[reservationDate].push({
          id,
          userId,
          department,
          notes
        });
      });
      setEvents(grouped);
    } catch (err) {
      console.error("예약 로딩 실패:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  const handleDayClick = (year, month, day) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(key);
    setEditData(null);
    setModalOpen(true); // ⬅️ 무조건 등록 폼 열기

    const isEmpty = !Array.isArray(events[key]) || events[key].length === 0;
    if (isEmpty) {
      setEditData(null);
      setModalOpen(true);
    }
  };
  
  
  


  const handleAddEvent = async (data) => {
    if (!selectedDate) return;
    try {
      await fetch('http://localhost:3000/test/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: data.userId,
          reservationDate: selectedDate,
          time: data.time,
          department: data.department,
          notes: data.notes
        })
      });
      fetchAppointments();
    } catch (err) {
      console.error("추가 실패:", err);
    }
    setModalOpen(false);
  };

  const handleEditEvent = async (dateKey, index, newData) => {
    const target = events[dateKey]?.[index];
    if (!target || !target.id) return;
    try {
      await fetch(`http://localhost:3000/test/appointments/${target.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: newData.userId,
          reservationDate: newData.reservationDate,
          time: newData.time,
          department: newData.department,
          notes: newData.notes
        })
      });
      fetchAppointments();
    } catch (err) {
      console.error("수정 실패:", err);
    }
    setModalOpen(false);
  };


  const handleDeleteEvent = async (id) => {
    try {
      await fetch(`http://localhost:3000/test/appointments/${id}`, {
        method: 'DELETE'
      });
      fetchAppointments();
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  const handleEditClick = (eventData) => {
    setEditData(eventData);
    setModalOpen(true);
  };
  const handleEventClick = (dateKey) => {
    setSelectedDate(dateKey);     // 하단 예약 목록 표시용
    setModalOpen(false);          // 등록 폼 닫힘 (중복 방지)
  };

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📅 예약 관리</h2>
        <button onClick={() => navigate('/Dashboard/reservations/list')} style={{
          padding: '6px 12px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          전체 목록 보기
        </button>
      </div>

      <CalendarGrid
        date={currentDate}
        events={events}
        onDayClick={handleDayClick}
        filterDept={selectedDept}
        selectedDept={selectedDept}
        onFilterChange={e => setSelectedDept(e.target.value)}
        onPrevMonth={() => changeMonth(-1)}
        onNextMonth={() => changeMonth(1)}
        onEventClick={handleEventClick}
      />

      <ReservationDetail
        dateKey={selectedDate}
        onAdd={() => {
          setEditData(null);
          setModalOpen(true);
        }}
        onEdit={handleEditClick}
        onDelete={handleDeleteEvent}
      />

      <ReservationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSave={(data) => {
          if (editData) {
            const idx = events[selectedDate]?.findIndex(e =>
              e.userId === editData.userId
            );
            if (idx > -1) handleEditEvent(selectedDate, idx, data);
          } else {
            handleAddEvent(data);
          }
        }}
        initialData={editData}
        selectedDate={selectedDate}
      />
    </Container>
  );
};

export default ReservationManager;
