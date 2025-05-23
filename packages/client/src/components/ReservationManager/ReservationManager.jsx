import React, { useState } from 'react';
import styled from '@emotion/styled';
import CalendarGrid from './CalendarGrid';
import ReservationDetail from './ReservationDetail';
import ReservationModal from './ReservationModal';

const Container = styled.div`
  padding: 30px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  margin-bottom: 10px;

  button {
    background: #007bff;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const ReservationManager = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4)); // 2025년 5월
  const [events, setEvents] = useState({
    '2025-05-01': [
      { time: '10:00', type: '🦷 치과 예약', doctor: '이승호' },
      { time: '14:00', type: '🧪 검사 일정', doctor: '김의사' }
    ],
    '2025-05-05': [
      { time: '11:00', type: '👶 소아과', doctor: '정소아' }
    ]
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const formatDateKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const handleDayClick = (year, month, day) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(key);
  };

  const handleAddEvent = (eventData) => {
    if (!selectedDate) return;
    setEvents(prev => {
      const updated = { ...prev };
      if (!updated[selectedDate]) updated[selectedDate] = [];
      updated[selectedDate].push(eventData);
      return updated;
    });
    setModalOpen(false);
  };

  const handleEditEvent = (dateKey, index, newTime) => {
    setEvents(prev => {
      const updated = { ...prev };
      updated[dateKey][index].time = newTime;
      return updated;
    });
  };

  const handleDeleteEvent = (dateKey, index) => {
    setEvents(prev => {
      const updated = { ...prev };
      updated[dateKey].splice(index, 1);
      if (updated[dateKey].length === 0) delete updated[dateKey];
      return updated;
    });
    if (selectedDate === dateKey && !events[dateKey]?.length) {
      setSelectedDate(null);
    }
  };

  const changeMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + delta);
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  return (
    <Container>
      <h2>📅 예약 관리</h2>

      <CalendarHeader>
        <button onClick={() => changeMonth(-1)}>⬅ 이전</button>
        <div><strong>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</strong></div>
        <button onClick={() => changeMonth(1)}>다음 ➡</button>
      </CalendarHeader>

      <CalendarGrid
        date={currentDate}
        events={events}
        onDayClick={handleDayClick}
      />

      <ReservationDetail
        dateKey={selectedDate}
        events={events}
        onAdd={() => setModalOpen(true)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      <ReservationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddEvent}
      />
    </Container>
  );
};

export default ReservationManager;
