import React, { useState } from 'react';
import styled from '@emotion/styled';
import ScheduleCalendar from './ScheduleCalendar';
import ScheduleList from './ScheduleList';
import SchedulePopup from './SchedulePopup';

const Container = styled.div`
  padding: 30px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;

  button {
    padding: 6px 12px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const StaffSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [scheduleData, setScheduleData] = useState({});
  const [popupOpen, setPopupOpen] = useState(false);

  const formatKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const changeMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const handleDateClick = (year, month, day) => {
    const selected = new Date(year, month, day);
    setSelectedDate(selected);
  };

  const handleAddSchedule = (item) => {
    const key = formatKey(selectedDate);
    const updated = { ...scheduleData };
    if (!updated[key]) updated[key] = [];
    updated[key].push(item);
    setScheduleData(updated);
    setPopupOpen(false);
  };

  const handleDeleteSchedule = (index) => {
    const key = formatKey(selectedDate);
    const updated = { ...scheduleData };
    updated[key].splice(index, 1);
    if (updated[key].length === 0) delete updated[key];
    setScheduleData(updated);
  };

  return (
    <Container>
      <h2>📆 의료진 근무 스케줄</h2>

      <Header>
        <button onClick={() => changeMonth(-1)}>⬅ 이전 달</button>
        <strong>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</strong>
        <button onClick={() => changeMonth(1)}>다음 달 ➡</button>
      </Header>

      <ScheduleCalendar
        currentDate={currentDate}
        scheduleData={scheduleData}
        onDateClick={handleDateClick}
      />

      <ScheduleList
        selectedDate={selectedDate}
        scheduleData={scheduleData}
        onDelete={handleDeleteSchedule}
        onOpenPopup={() => setPopupOpen(true)}
      />

      <SchedulePopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        onSave={handleAddSchedule}
      />
    </Container>
  );
};

export default StaffSchedule;
