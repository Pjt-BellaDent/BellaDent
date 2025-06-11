// ✅ BellaDent 예약관리 영역 리팩토링 적용 완료
// ✅ 기준: React 표준 구조 + Tailwind CSS + axiosInstance 통일

// ReservationManager.jsx (Tailwind 버전)
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ReservationTimeTable from './ReservationTimeTable';
import ReservationModal from './ReservationModal';
import {
  fetchAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../../../api/appointments';

const koreanWeekdays = ['일', '월', '화', '수', '목', '금', '토'];
const departments = [
  { name: '보철과', color: '#3cc441' },
  { name: '교정과', color: '#f5433a' },
  { name: '치주과', color: '#1794f7' },
];
const times = ['10:00','11:00','13:00','14:00','15:00','16:00','17:00'];

const pad = n => String(n).padStart(2, '0');
const getDateStr = date =>
  date ? `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}` : '';

const CalendarPanel = ({ selectedDate, onDateChange, events }) => {
  const dateStr = getDateStr(selectedDate);
  const todayEvents = events[dateStr] || [];

  const closedDepts = departments.filter(d => {
    const bookedTimes = todayEvents
      .filter(e => e.department === d.name)
      .flatMap(e => {
        if (e.startTime && e.endTime) {
          const idxStart = times.indexOf(e.startTime);
          const idxEnd = times.indexOf(e.endTime);
          if (idxStart !== -1 && idxEnd !== -1) return times.slice(idxStart, idxEnd + 1);
        }
        return [];
      });
    return times.every(t => bookedTimes.includes(t));
  });

  return (
    <div>
      <div className="[&_.react-calendar]:bg-transparent [&_.react-calendar]:border-none [&_.react-calendar__tile--active]:bg-blue-600 [&_.react-calendar__tile--active]:text-white [&_.react-calendar__tile--active]:rounded-md [&_.react-calendar__tile--now]:bg-[#24335a] [&_.react-calendar__tile--now]:text-white [&_.react-calendar__tile--now]:rounded-md">
        <Calendar
          value={selectedDate}
          onChange={onDateChange}
          locale="en-US"
          formatMonthYear={(locale, date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`}
          formatShortWeekday={(locale, date) => koreanWeekdays[date.getDay()]}
          tileContent={({ date, view }) => {
            if (view !== 'month') return null;
            const dateKey = getDateStr(date);
            const eventsForDay = events[dateKey] || [];
            const closedDeptsForDay = departments.filter(d => {
              const bookedTimes = eventsForDay
                .filter(e => e.department === d.name)
                .flatMap(e => {
                  if (e.startTime && e.endTime) {
                    const idxStart = times.indexOf(e.startTime);
                    const idxEnd = times.indexOf(e.endTime);
                    if (idxStart !== -1 && idxEnd !== -1) return times.slice(idxStart, idxEnd + 1);
                  }
                  return [];
                });
              return times.every(t => bookedTimes.includes(t));
            });
            return (
              <div className="flex justify-center gap-1 mt-1">
                {closedDeptsForDay.map(d => (
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
      <div className="my-2 text-sm min-h-[20px]">
        {closedDepts.map(d => (
          <span
            key={d.name}
            className="inline-block text-white rounded-full px-2 py-0.5 font-semibold text-xs mr-2"
            style={{ backgroundColor: d.color }}
          >
            {d.name} 마감
          </span>
        ))}
      </div>
      <div className="font-bold text-[17px] my-2">{dateStr || '일자 선택'}</div>
      <ul className="list-none p-0 m-0">
        {todayEvents.length === 0 ? (
          <li className="text-gray-400">예약 없음</li>
        ) : todayEvents
            .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
            .map(e => (
              <li
                key={e.id || (e.name + e.birth + e.startTime)}
                className="text-[15px] bg-[#232438] mb-1.5 rounded-lg px-3 py-2 flex items-center gap-2"
              >
                <span className="dot w-[9px] h-[9px] rounded-full inline-block bg-[#41c5f2]" />
                {e.startTime}
                {e.endTime && e.startTime !== e.endTime ? `~${e.endTime}` : ''}
                <span className="ml-1">
                  {e.name}
                  {e.birth && (
                    <span className="text-[13px] text-gray-400 ml-1">({e.birth})</span>
                  )}
                </span>
                <span className="text-[13px] text-blue-400">{e.department}</span>
              </li>
        ))}
      </ul>
    </div>
  );
};

const ReservationManager = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const getDateStr = (date) =>
    date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      : '';

  const getMonthStr = (date) =>
    date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : '';

  const fetchEvents = async () => {
    try {
      const month = getMonthStr(selectedDate);
      const data = await fetchAppointments(month);
      const grouped = {};
      data.forEach(item => {
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
    fetchEvents();
  }, [selectedDate]);

  const handleSave = async (formData) => {
    try {
      if (editData?.id) {
        await updateAppointment(editData.id, formData);
      } else {
        await createAppointment(formData);
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

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await deleteAppointment(id);
      fetchEvents();
    } catch (err) {
      alert('삭제 실패');
    }
  };

  const handleAdd = (prefill = {}) => {
    setEditData({
      department: prefill.department || '',
      date: getDateStr(selectedDate),
      startTime: prefill.startTime || '',
      endTime: prefill.endTime || '',
    });
    setModalOpen(true);
  };

  const dateStr = getDateStr(selectedDate);

  return (
    <div className="flex gap-8 items-start">
      <div className="w-[320px] bg-[#1a1b1d] text-white rounded-[13px] p-[18px] shadow-md">
        <CalendarPanel
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          events={events}
        />
      </div>
      <div className="flex-1 bg-white rounded-xl min-h-[550px] shadow-md p-8">
        <ReservationTimeTable
          date={dateStr}
          events={events}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </div>
      <ReservationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSave={handleSave}
        initialData={editData}
        selectedDate={dateStr}
        eventsForDate={events[dateStr] || []}
      />
    </div>
  );
};

export default ReservationManager;
