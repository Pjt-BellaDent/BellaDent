import React from 'react';

const ScheduleCalendar = ({
  currentDate,
  scheduleData,
  onDateClick,
  onScheduleClick,
  filterStaffId = '전체',
  staffList = [],
  onPrevMonth,
  onNextMonth,
  onFilterChange,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="bg-white" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    let daySchedules = scheduleData[key] || [];

    if (filterStaffId !== '전체') {
      daySchedules = daySchedules.filter(e => e.uid === filterStaffId);
    }

    const sorted = [...daySchedules].sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));
    const isToday = new Date().toISOString().split('T')[0] === key;
    const isWeekend = (firstDay + day - 1) % 7 === 0 || (firstDay + day - 1) % 7 === 6;

    cells.push(
      <div
        key={key}
        className={`bg-white min-h-[120px] p-2 cursor-pointer transition-colors ${
          isToday ? 'bg-blue-50' : ''
        }`}
        onClick={e => {
          if (e.target === e.currentTarget) {
            onDateClick(year, month, day);
          }
        }}
      >
        <div className={`font-medium mb-2 ${
          isWeekend ? ((firstDay + day - 1) % 7 === 0 ? 'text-red-500' : 'text-blue-500') : 'text-gray-800'
        }`}>
          {day}
        </div>
        <div className="overflow-y-auto max-h-[80px] space-y-1 scrollbar-hide">
          {sorted.map((e, i) => (
            <div
              key={i}
              className="text-xs bg-blue-50 text-blue-700 rounded px-2 py-1 truncate hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
              onClick={evt => {
                evt.stopPropagation();
                if (onScheduleClick) onScheduleClick(e, key);
              }}
            >
              {e.startTime && e.endTime ? `${e.startTime}~${e.endTime}` : ''}
              {e.memo && <span>{e.memo}</span>}
              {e.off && <span className="ml-1 text-red-500">🌙 휴무</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      <div className="flex justify-between items-center px-6 py-4 border-b bg-[#f7fafd]">
        <div className="flex items-center gap-3">
          <button onClick={onPrevMonth} className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors">
            ⬅ 이전
          </button>
          <button onClick={onNextMonth} className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors">
            다음 ➡
          </button>
        </div>
        <div className="text-xl font-bold text-gray-800">{year}년 {month + 1}월</div>
        <div>
          <select
            value={filterStaffId}
            onChange={onFilterChange}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="전체" key="all">전체</option>
            {staffList.map(staff => (
              <option key={staff.uid} value={staff.uid}>{staff.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
          <div key={day} className={`bg-[#f7fafd] text-center py-3 font-medium ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-800'}`}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {cells}
      </div>
    </div>
  );
};

export default ScheduleCalendar;
