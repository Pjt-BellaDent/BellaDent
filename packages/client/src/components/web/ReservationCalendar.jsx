// src/components/web/ReservationCalendar.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { fetchAllStaff } from '../../api/scheduleApi';
import axios from '../../libs/axiosInstance.js';

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

const pad = (n) => String(n).padStart(2, '0');

const formatDateToYYYYMMDD = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
};

const getMonthStart = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};
const getMonthEnd = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isToday = (date) => isSameDay(date, new Date());

const addMonths = (date, amount) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + amount);
  return newDate;
};

const subMonths = (date, amount) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - amount);
  return newDate;
};

const eachDayOfInterval = ({ start, end }) => {
  const days = [];
  let currentDate = new Date(start);
  while (currentDate <= end) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return days;
};

const HOUR_MAP = Array.from({ length: 18 }, (_, i) => {
  const hour = 9 + Math.floor(i / 2);
  const minute = (i % 2) * 30;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
});

const ReservationCalendar = ({ onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const monthStart = getMonthStart(currentMonth);
  const monthEnd = getMonthEnd(currentMonth);

  const daysInMonth = useMemo(() => {
    const startDay = monthStart.getDay();
    const daysBefore = Array.from({ length: startDay }, (_, i) => null);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    return [...daysBefore, ...days];
  }, [currentMonth]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const monthString = formatDateToYYYYMMDD(currentMonth).slice(0, 7);

        const fetchedAppointmentsResponse = await axios.get('/appointments', {
          params: { month: monthString },
        });
        const fetchedAppointments = fetchedAppointmentsResponse.data;

        const fetchedStaff = await fetchAllStaff();

        setAppointments(fetchedAppointments);
        setStaffList(fetchedStaff);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
        setError('예약 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentMonth]);

  const goToPrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const isDayAvailableForBooking = (day) => {
    if (!day) return false;
    const dayString = formatDateToYYYYMMDD(day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) {
      return false;
    }

    for (const staff of staffList) {
      if (!staff.uid) continue;

      for (const timeSlot of HOUR_MAP) {
        const isBooked = appointments.some(
          (app) =>
            formatDateToYYYYMMDD(new Date(app.date)) === dayString &&
            app.doctorUid === staff.uid &&
            app.startTime === timeSlot
        );
        if (!isBooked) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-inner">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPrevMonth}
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
        >
          이전 달
        </button>
        <h2 className="text-xl font-bold">
          {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
        </h2>
        <button
          onClick={goToNextMonth}
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
        >
          다음 달
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-sm mb-2">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className={
              day === '일'
                ? 'text-red-500'
                : day === '토'
                ? 'text-blue-500'
                : ''
            }
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, index) => (
          <button
            key={index}
            onClick={() => day && onDateSelect(formatDateToYYYYMMDD(day))}
            className={`p-2 rounded-md transition-colors text-sm
              ${day ? 'hover:bg-blue-100' : 'bg-gray-50 cursor-default'}
              ${
                isSameDay(day, new Date())
                  ? 'border-2 border-blue-500 font-bold'
                  : ''
              }
              ${
                isDayAvailableForBooking(day)
                  ? 'bg-green-100 text-green-700'
                  : ''
              }
              ${
                !day ||
                day.setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)
                  ? 'text-gray-400 cursor-not-allowed'
                  : ''
              }
            `}
            disabled={
              !day ||
              day.setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)
            }
          >
            {day ? day.getDate() : ''}
          </button>
        ))}
      </div>
      {loading && (
        <p className="text-center mt-4 text-gray-600">예약 정보 로딩 중...</p>
      )}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      <p className="text-xs text-gray-500 mt-4">
        <span className="inline-block w-3 h-3 bg-green-100 rounded-full mr-1"></span>{' '}
        예약 가능 날짜
        <span className="inline-block w-3 h-3 border-2 border-blue-500 rounded-full ml-3 mr-1"></span>{' '}
        오늘
      </p>
    </div>
  );
};

export default ReservationCalendar;
