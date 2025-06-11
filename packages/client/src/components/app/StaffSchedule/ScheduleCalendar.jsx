import React from 'react';

const ScheduleCalendar = ({
  currentDate,
  scheduleData,
  onDateClick,
  filterRank = '전체',
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
    cells.push(<div key={`empty-${i}`} className="border border-gray-200" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    let daySchedules = scheduleData[key] || [];

    if (filterRank !== '전체') {
      daySchedules = daySchedules.filter(e => e.rank === filterRank);
    }

    const sorted = [...daySchedules].sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));

    cells.push(
      <div
        key={key}
        onClick={() => onDateClick(year, month, day)}
        className="border border-gray-200 p-2 text-sm cursor-pointer flex flex-col items-start hover:bg-gray-50"
      >
        <div className="font-semibold text-gray-800 mb-1">{day}</div>
        <div className="overflow-y-auto max-h-[60px] w-full">
          {sorted.map((e, i) => (
            <div
              key={i}
              className="text-xs bg-blue-50 text-blue-700 rounded px-2 py-0.5 mb-1 truncate w-full"
            >
              • {`${e.time || ''} ${e.rank || ''} ${e.name || ''}`}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded-md">
      <div className="flex justify-between items-center px-5 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <button onClick={onPrevMonth} className="text-blue-600 text-sm hover:underline">⬅ 이전</button>
          <button onClick={onNextMonth} className="text-blue-600 text-sm hover:underline">다음 ➡</button>
        </div>
        <div className="text-sm font-bold text-gray-800">{year}년 {month + 1}월</div>
        <div>
          <select
            value={filterRank}
            onChange={onFilterChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="전체">전체</option>
            <option value="원장">원장</option>
            <option value="부원장">부원장</option>
            <option value="과장">과장</option>
            <option value="상담사">상담사</option>
            <option value="수납">수납</option>
            <option value="치위생사">치위생사</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center font-bold text-gray-600 bg-gray-100 py-2">
        {['일', '월', '화', '수', '목', '금', '토'].map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 auto-rows-[100px]">
        {cells}
      </div>
    </div>
  );
};

export default ScheduleCalendar;
