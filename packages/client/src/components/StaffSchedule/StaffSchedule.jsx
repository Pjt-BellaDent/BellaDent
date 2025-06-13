import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import ScheduleCalendar from './ScheduleCalendar';
import ScheduleList from './ScheduleList';
import SchedulePopup from './SchedulePopup';
import { useNavigate } from 'react-router-dom';
import {
  fetchSchedulesByMonth,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../../api/scheduleApi';

const Container = styled.div`
  padding: 30px;
`;

const StaffSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [scheduleData, setScheduleData] = useState({});
  const [popupOpen, setPopupOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filterRank, setFilterRank] = useState('전체');
  const navigate = useNavigate();

  const formatKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const changeMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const loadSchedules = async () => {
    const month = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const data = await fetchSchedulesByMonth(month);
    const grouped = {};
    data.forEach((d) => {
      if (!grouped[d.scheduleDate]) grouped[d.scheduleDate] = [];
      grouped[d.scheduleDate].push(d);
    });
    setScheduleData(grouped);
  };

  useEffect(() => {
    loadSchedules();
  }, [currentDate]);

  const handleDateClick = (year, month, day) => {
    const selected = new Date(year, month, day);
    setSelectedDate(selected);
  };

  const handleAddSchedule = async (item) => {
    const key = formatKey(selectedDate);
    item.scheduleDate = key;

    if (editData?.id) {
      await updateSchedule(editData.id, item);
    } else {
      await createSchedule(item);
    }

    setPopupOpen(false);
    setEditData(null);
    loadSchedules();
  };

  const handleDeleteSchedule = async (itemId) => {
    await deleteSchedule(itemId);
    loadSchedules();
  };

  const handleEdit = (item) => {
    setEditData(item);
    setPopupOpen(true);
  };

  const handleOpenPopup = () => {
    setEditData(null);
    setPopupOpen(true);
  };

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📆 의료진 근무 스케줄</h2>
        <button onClick={() => navigate('/Dashboard/reservations/list')} style={{
          padding: '6px 12px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          전체 목록
        </button>
      </div>
      <ScheduleCalendar
        currentDate={currentDate}
        scheduleData={scheduleData}
        onDateClick={handleDateClick}
        filterRank={filterRank}
        onPrevMonth={() => changeMonth(-1)}
        onNextMonth={() => changeMonth(1)}
        onFilterChange={(e) => setFilterRank(e.target.value)}
      />

      <ScheduleList
        selectedDate={selectedDate}
        scheduleData={scheduleData}
        onDelete={handleDeleteSchedule}
        onOpenPopup={handleOpenPopup}
        onEdit={handleEdit}
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
