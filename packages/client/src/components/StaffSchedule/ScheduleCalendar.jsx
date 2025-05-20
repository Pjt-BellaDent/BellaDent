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

  &:hover {
    background-color: #f1f3f5;
  }
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

const ScheduleCalendar = ({ currentDate, scheduleData, onDateClick }) => {
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
    const hasSchedule = !!scheduleData[key]?.length;

    cells.push(
      <Cell key={key} onClick={() => onDateClick(year, month, day)}>
        <DayNumber>{day}</DayNumber>
        {hasSchedule && <Dot />}
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
