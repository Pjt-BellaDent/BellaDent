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
  margin-bottom: 20px;
  font-size: 14px;

  .nav {
    display: flex;
    gap: 10px;

    button {
      background: none;
      border: none;
      color: #007bff;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
  }

  .month {
    font-size: 16px;
    font-weight: bold;
  }

  .filter select {
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
`;


const FilterBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;

  select {
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
`;

const ReservationManager = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4));
  const [selectedDept, setSelectedDept] = useState('전체');
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [events, setEvents] = useState({
    '2025-05-01': [
      { time: '10:00', type: '보철과', name: '이수민', memo: '앞니 시술상담' },
      { time: '14:00', type: '교정과', name: '김하늘', memo: '교정 중간 체크' }
    ],
    '2025-05-05': [
      { time: '11:00', type: '잇몸클리닉', name: '정하늘', memo: '잇몸 염증 체크' }
    ]
  });

  const formatDateKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const changeMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + delta);
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

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
    setEditData(null);
  };

  const handleEditEvent = (dateKey, index, newData) => {
    setEvents(prev => {
      const updated = { ...prev };
      updated[dateKey][index] = newData;
      return updated;
    });
    setModalOpen(false);
    setEditData(null);
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

  const handleEditClick = (eventData) => {
    setEditData(eventData);
    setModalOpen(true);
  };

  return (
    <Container>
      <h2>📅 예약 관리</h2>

      <CalendarHeader>
  <div className="nav">
    <button onClick={() => changeMonth(-1)}>⬅ 이전</button>
    <button onClick={() => changeMonth(1)}>다음 ➡</button>
  </div>

  <div className="month">
    {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
  </div>

  <div className="filter">
    <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
      <option value="전체">전체</option>
      <option value="보철과">보철과</option>
      <option value="교정과">교정과</option>
      <option value="잇몸클리닉">잇몸클리닉</option>
    </select>
  </div>
</CalendarHeader>

      <CalendarGrid
        date={currentDate}
        events={events}
        onDayClick={handleDayClick}
        filterDept={selectedDept}
      />


      <ReservationDetail
        dateKey={selectedDate}
        events={events}
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
              e.name === editData.name && e.time === editData.time
            );
            if (idx > -1) handleEditEvent(selectedDate, idx, data);
          } else {
            handleAddEvent(data);
          }
        }}
        initialData={editData}
      />
    </Container>
  );
};

export default ReservationManager;
