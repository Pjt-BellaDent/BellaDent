// src/components/app/reservations/ReservationManager.jsx
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ReservationTimeTable from './ReservationTimeTable';
import ReservationModal from './ReservationModal';
import {
  fetchAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from '../../../api/patients';
import { fetchAllStaff } from '../../../api/scheduleApi';

const koreanWeekdays = ['일', '월', '화', '수', '목', '금', '토'];
const departments = [
  { name: '보철과', color: '#3cc441' },
  { name: '교정과', color: '#f5433a' },
  { name: '치주과', color: '#1794f7' },
];
const times = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const pad = (n) => String(n).padStart(2, '0');
const getDateStr = (date) =>
  date
    ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    : '';

const CalendarPanel = ({ selectedDate, onDateChange, events }) => {
  const dateStr = getDateStr(selectedDate);
  const todayEvents = events[dateStr] || [];

  const closedDepts = departments.filter((d) => {
    const bookedTimes = todayEvents
      .filter((e) => e.department === d.name)
      .flatMap((e) => {
        if (e.startTime && e.endTime) {
          const idxStart = times.indexOf(e.startTime);
          const idxEnd = times.indexOf(e.endTime);
          if (idxStart !== -1 && idxEnd !== -1)
            return times.slice(idxStart, idxEnd + 1);
        }
        return [];
      });
    return times.every((t) => bookedTimes.includes(t));
  });

  return (
    <div className="flex flex-row lg:flex-col items-start gap-6">
      <div className="w-auto lg:w-full">
        <div className="[&_.react-calendar]:bg-white [&_.react-calendar]:border [&_.react-calendar]:border-gray-200 [&_.react-calendar]:rounded-lg [&_.react-calendar__tile--active]:bg-blue-600 [&_.react-calendar__tile--active]:text-white [&_.react-calendar__tile--active]:rounded-md [&_.react-calendar__tile--now]:bg-blue-100 [&_.react-calendar__tile--now]:text-blue-700 [&_.react-calendar__tile--now]:rounded-md [&_.react--calendar__month-view__weekdays]:text-gray-600 [&_.react-calendar__month-view__days__day]:text-gray-800 [&_.react-calendar__navigation__label]:text-gray-800 [&_.react-calendar__navigation__arrow]:text-gray-800 [&_.react-calendar__month-view__days__day--weekend]:text-red-500 [&_.react-calendar__month-view__days__day--neighboringMonth]:text-gray-400 [&_.react-calendar__tile]:rounded-md [&_.react-calendar__tile:enabled:hover]:bg-gray-100 [&_.react-calendar__tile:enabled:hover]:text-gray-900 [&_.react-calendar__navigation__label]:hover:bg-transparent [&_.react-calendar__navigation__arrow]:hover:bg-transparent [&_.react-calendar__month-view__weekdays__weekday]:text-center [&_.react-calendar__month-view__weekdays__weekday]:py-2 [&_.react-calendar__month-view__days__day]:p-2 [&_.react-calendar__month-view__days__day]:h-12 [&_.react-calendar__month-view__days__day]:flex [&_.react-calendar__month-view__days__day]:justify-center [&_.react-calendar__month-view__days__day]:items-center [&_.react-calendar__month-view__weekdays__weekday:last-child]:text-red-500">
          <Calendar
            value={selectedDate}
            onChange={onDateChange}
            locale="ko-KR"
            calendarType="gregory"
            formatMonthYear={(locale, date) =>
              `${date.getFullYear()}년 ${date.getMonth() + 1}월`
            }
            formatShortWeekday={(locale, date) => koreanWeekdays[date.getDay()]}
            tileClassName={({ date, view }) => {
              const day = date.getDay();
              return view === 'month' && (day === 0 || day === 6)
                ? 'text-red-500'
                : null;
            }}
            tileContent={({ date, view }) => {
              if (view !== 'month') return null;
              const dateKey = getDateStr(date);
              const eventsForDay = events[dateKey] || [];
              const closedDeptsForDay = departments.filter((d) => {
                const bookedTimes = eventsForDay
                  .filter((e) => e.department === d.name)
                  .flatMap((e) => {
                    if (e.startTime && e.endTime) {
                      const idxStart = times.indexOf(e.startTime);
                      const idxEnd = times.indexOf(e.endTime);
                      if (idxStart !== -1 && idxEnd !== -1)
                        return times.slice(idxStart, idxEnd + 1);
                    }
                    return [];
                  });
                return times.every((t) => bookedTimes.includes(t));
              });
              return (
                <div className="flex justify-center gap-1 mt-1">
                  {closedDeptsForDay.map((d) => (
                    <span
                      key={d.name}
                      className="w-[7px] h-[7px] rounded-full inline-block"
                      style={{ background: d.color }}
                      title={`${d.name} 마감`}
                    />
                  ))}
                </div>
              );
            }}
          />
        </div>
      </div>
      <div className="flex-1 w-full mt-4 lg:mt-6">
        <div className="mb-2 text-sm min-h-[20px]">
          {closedDepts.map((d) => (
            <span
              key={d.name}
              className="inline-block text-white rounded-full px-2 py-0.5 font-semibold text-xs mr-2"
              style={{ backgroundColor: d.color }}
            >
              {d.name} 마감
            </span>
          ))}
        </div>
        <div className="font-bold text-[17px] mb-2">
          {dateStr
            ? `${selectedDate.getFullYear()}년 ${
                selectedDate.getMonth() + 1
              }월 ${selectedDate.getDate()}일`
            : '일자 선택'}
        </div>
        <ul className="list-none p-0 m-0 max-h-48 overflow-y-auto">
          {todayEvents.length === 0 ? (
            <li className="text-gray-400">예약 없음</li>
          ) : (
            todayEvents
              .sort((a, b) =>
                (a.startTime || '').localeCompare(b.startTime || '')
              )
              .map((e) => (
                <li
                  key={e.id || e.name + e.birth + e.startTime}
                  className="text-[15px] bg-gray-100 mb-1.5 rounded-lg px-3 py-2 flex flex-wrap items-center gap-x-2"
                >
                  <span className="dot w-[9px] h-[9px] rounded-full inline-block bg-blue-500" />
                  {e.startTime}
                  {e.endTime && e.startTime !== e.endTime
                    ? `~${e.endTime}`
                    : ''}
                  <span className="ml-1">
                    {e.name}
                    {e.birth && (
                      <span className="text-[13px] text-gray-500 ml-1">
                        ({e.birth})
                      </span>
                    )}
                  </span>
                  <span className="text-[13px] text-blue-600">
                    {e.department}
                  </span>
                </li>
              ))
          )}
        </ul>
      </div>
    </div>
  );
};

const ReservationManager = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [staff, setStaff] = useState([]);

  const handleDateChange = (date) => {
    if (!date) {
      setSelectedDate(new Date());
    } else if (Array.isArray(date)) {
      setSelectedDate(new Date(date[0]));
    } else if (date instanceof Date && !isNaN(date)) {
      setSelectedDate(date);
    } else {
      setSelectedDate(new Date(date));
    }
  };

  const getMonthStr = (date) =>
    date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      : '';

  const fetchEvents = async () => {
    try {
      const month = getMonthStr(selectedDate);
      const data = await fetchAppointments(month);
      const grouped = {};
      data.forEach((item) => {
        const dateKey = item.date;
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(item);
      });
      setEvents(grouped);
    } catch (err) {
      console.error('예약 불러오기 실패', err);
    }
  };

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const staffData = await fetchAllStaff();
        const doctors = staffData.filter(
          (member) => member.role === 'manager' && member.name !== '매니져'
        );
        setStaff(doctors);
      } catch (error) {
        console.error('Failed to fetch staff:', error);
      }
    };

    loadStaff();
    fetchEvents();
  }, [selectedDate]);

  const handleSave = async (formData) => {
    try {
      if (editData && editData.id) {
        await updateAppointment(editData.id, formData);
      } else {
        const newAppointment = await addAppointment(formData);
      }
      setModalOpen(false);
      setEditData(null);
      fetchEvents();
    } catch (err) {
      console.error('저장 실패', err);
    }
  };

  const handleEditClick = (eventData) => {
    setEditData(eventData);
    setModalOpen(true);
  };

  const handleAddClick = (prefillData) => {
    setEditData(prefillData);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말로 이 예약을 삭제하시겠습니까?')) return;
    if (!id) return;
    try {
      await deleteAppointment(id);
      fetchEvents();
    } catch (err) {
      console.error('삭제 실패', err);
    }
  };

  const dateStr = getDateStr(selectedDate);

  return (
    <div className="p-1 sm:p-2 md:p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-auto bg-white p-2 sm:p-4 rounded-lg shadow-md">
          <CalendarPanel
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            events={events}
          />
        </div>
        <div className="w-full lg:flex-1 bg-white p-2 sm:p-4 rounded-lg shadow-md">
          <ReservationTimeTable
            selectedDate={selectedDate}
            events={events[getDateStr(selectedDate)] || []}
            staff={staff}
            onAdd={handleAddClick}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        </div>
      </div>
      {modalOpen && (
        <ReservationModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditData(null);
          }}
          onSave={handleSave}
          initialData={editData}
          date={getDateStr(selectedDate)}
          staffList={staff}
        />
      )}
    </div>
  );
};

export default ReservationManager;
