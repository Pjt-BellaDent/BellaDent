import React from 'react';
import styled from '@emotion/styled';

const CalendarWrapper = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const DaysHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  background: #f8f9fa;
  padding: 10px 0;
  font-weight: bold;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 100px;
`;

const Cell = styled.div`
  border: 1px solid #eee;
  padding: 6px;
  position: relative;
  cursor: pointer;
  overflow-y: auto;
`;

const DayNumber = styled.div`
  font-size: 13px;
  color: #333;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background: #007bff;
  border-radius: 50%;
  margin-top: 6px;
`;

const Entry = styled.div`
  font-size: 12px;
  margin-top: 4px;
  padding: 2px 4px;
  background: #e9f5ff;
  border-radius: 4px;
`;

const ScheduleCalendar = ({ currentDate, scheduleData, onDateClick, filterRank }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(<Cell key={`empty-${i}`} />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    let daySchedules = scheduleData[key] || [];

    // 🔍 직급 필터링
    if (filterRank !== '전체') {
      daySchedules = daySchedules.filter(e => e.rank === filterRank);
    }

    cells.push(
      <Cell key={key} onClick={() => onDateClick(year, month, day)}>
        <DayNumber>{day}</DayNumber>
        {daySchedules.length > 0 ? (
          daySchedules.map((e, i) => (
            <Entry key={i}>{`${e.rank} ${e.name} (${e.time})`}</Entry>
          ))
        ) : null}
      </Cell>
    );
  }

  return (
    <CalendarWrapper>
      <DaysHeader>
        {['일', '월', '화', '수', '목', '금', '토'].map(d => <div key={d}>{d}</div>)}
      </DaysHeader>
      <Grid>{cells}</Grid>
    </CalendarWrapper>
  );
};

export default ScheduleCalendar;
