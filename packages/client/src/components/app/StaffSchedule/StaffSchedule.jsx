// src/components/app/StaffSchedule/StaffSchedule.jsx 
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
  fetchAllStaff,
} from '../../../api/scheduleApi';

const StaffSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [scheduleData, setScheduleData] = useState({});
  const [popupOpen, setPopupOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filterStaffId, setFilterStaffId] = useState('전체');
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(date.getDate()).padStart(2, '0')}`;

  const changeMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const month = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, '0')}`;
      const data = await fetchSchedulesByMonth(month);
      const grouped = {};
      data.forEach((d) => {
        const schedule = {
          ...d,
          uid: d.uid || d.staffId || d.id,
          position: d.position || d.rank,
        };
        if (!grouped[d.scheduleDate]) grouped[d.scheduleDate] = [];
        grouped[d.scheduleDate].push(schedule);
      });
      setScheduleData(grouped);
    } catch (err) {
      console.error('스케줄 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, [currentDate]);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const staff = await fetchAllStaff();
        setStaffList(
          staff.map((s) => ({
            ...s,
            uid: s.uid || s.id || s.staffId,
            position: s.position || s.staffInfo?.position || '',
            department: s.department || s.staffInfo?.department || '',
          }))
        );
      } catch (error) {
        console.error('직원 목록 로드 실패:', error);
        setStaffList([]);
      }
    };
    loadStaff();
  }, []);

  const handleDateClick = (year, month, day) => {
    const selected = new Date(year, month, day);
    setSelectedDate(selected);
    setEditData(null);
    setPopupOpen(false);
  };

  const handleScheduleClick = (schedule, dateKey) => {
    setEditData({ ...schedule, scheduleDate: dateKey });
    setPopupOpen(true);
  };

  const handleAddSchedule = async (item) => {
    const key = formatKey(selectedDate);
    item.scheduleDate = key;

    try {
      if (editData?.id) {
        await updateSchedule(editData.id, item);
      } else {
        await createSchedule(item);
      }
      setPopupOpen(false);
      setEditData(null);
      loadSchedules();
    } catch (error) {
      console.error('스케줄 저장 실패:', error);
      alert('스케줄 저장에 실패했습니다. 다시 시도해주세요.');
    }
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

  if (loading) {
    return (
      <div className="p-6 bg-[#f4f7fc] min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f4f7fc] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📆 의료진 근무 스케줄</h2>
        <div className="flex gap-2">
          <button
            onClick={handleOpenPopup}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            + 새 스케줄
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScheduleCalendar
            currentDate={currentDate}
            scheduleData={scheduleData}
            onDateClick={handleDateClick}
            onScheduleClick={handleScheduleClick}
            filterStaffId={filterStaffId}
            staffList={staffList}
            onPrevMonth={() => changeMonth(-1)}
            onNextMonth={() => changeMonth(1)}
            onFilterChange={(e) => setFilterStaffId(e.target.value)}
          />
        </div>

        <div className="lg:col-span-1">
          <ScheduleList
            selectedDate={selectedDate}
            scheduleData={scheduleData}
            onDelete={handleDeleteSchedule}
            onOpenPopup={handleOpenPopup}
            onEdit={handleEdit}
            filterStaffId={filterStaffId}
          />
        </div>
      </div>

      <SchedulePopup
        open={popupOpen}
        onClose={() => {
          setPopupOpen(false);
          setEditData(null);
        }}
        onSave={handleAddSchedule}
        initialData={editData}
        staffList={staffList}
        selectedStaffId={filterStaffId}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default StaffSchedule;
