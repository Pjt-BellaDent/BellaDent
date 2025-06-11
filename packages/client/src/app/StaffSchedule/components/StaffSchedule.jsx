import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScheduleCalendar from './ScheduleCalendar';
import ScheduleList from './ScheduleList';
import SchedulePopup from './SchedulePopup';
import {
  fetchSchedulesByMonth,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../../api/scheduleApi';

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📆 의료진 근무 스케줄</h2>
        <button
          onClick={() => navigate('/Dashboard/reservations/list')}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
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
    </div>
  );
};

export default StaffSchedule;
