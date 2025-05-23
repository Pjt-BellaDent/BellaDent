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
  background: #f1f3f5;
  padding: 10px 0;
  font-weight: bold;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 120px;
`;

const Cell = styled.div`
  border: 1px solid #eee;
  padding: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
`;

const DayNumber = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 5px;
`;

const Event = styled.div`
  font-size: 12px;
  background: #007bff;
  color: white;
  border-radius: 4px;
  padding: 2px 6px;
  margin-top: 4px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EventWrapper = styled.div`
  max-height: 90px; // 셀 내에서 스크롤이 필요한 영역 높이
  overflow-y: auto;
`;

const CalendarGrid = ({ date, events, onDayClick, filterDept }) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(<Cell key={`empty-${i}`} />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    let dayEvents = events[key] || [];

    if (filterDept !== '전체') {
      dayEvents = dayEvents.filter(e => e.type === filterDept);
    }

    const sortedEvents = [...dayEvents].sort((a, b) => a.time.localeCompare(b.time));

    cells.push(
      <Cell key={key} onClick={() => onDayClick(year, month, day)}>
      <DayNumber>{day}</DayNumber>
      <EventWrapper>
        {dayEvents.map((e, i) => (
          <Event key={i}>
            {`${e.type || '진료과'} - ${e.time || '시간'} - ${e.name || '이름'}`}
          </Event>
        ))}
      </EventWrapper>
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

export default CalendarGrid;
