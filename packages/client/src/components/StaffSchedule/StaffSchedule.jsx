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
  align-items: center;
  margin-bottom: 20px;

  .nav-group {
    display: flex;
    gap: 8px;
  }

  .nav-button {
    background: transparent;
    color: #007bff;
    border: none;
    font-size: 14px;
    cursor: pointer;
    font-weight: 500;
  }

  .month-label {
    font-weight: bold;
    font-size: 16px;
  }

  .filter {
    display: flex;
    align-items: center;
    gap: 10px;

    select {
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }
  }
`;



const StaffSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [scheduleData, setScheduleData] = useState({});
  const [popupOpen, setPopupOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filterRank, setFilterRank] = useState('전체');

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
    if (editData) {
      const index = updated[key].findIndex(e =>
        e.name === editData.name && e.time === editData.time
      );
      if (index > -1) updated[key][index] = item;
    } else {
      updated[key].push(item);
    }
    setScheduleData(updated);
    setPopupOpen(false);
    setEditData(null);
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
      <ScheduleCalendar
        currentDate={currentDate}
        scheduleData={scheduleData}
        onDateClick={handleDateClick}
        filterRank={filterRank}
        onFilterChange={(e) => setFilterRank(e.target.value)}
      />

      <ScheduleList
        selectedDate={selectedDate}
        scheduleData={scheduleData}
        onDelete={handleDeleteSchedule}
        onOpenPopup={() => {
          setPopupOpen(true);
          setEditData(null);
        }}
        onEdit={(item) => {
          setPopupOpen(true);
          setEditData(item);
        }}
      />

      <SchedulePopup
        open={popupOpen}
        onClose={() => {
          setPopupOpen(false);
          setEditData(null);
        }}
        onSave={handleAddSchedule}
        initialData={editData}
      />
    </Container>
  );
};

export default StaffSchedule;
