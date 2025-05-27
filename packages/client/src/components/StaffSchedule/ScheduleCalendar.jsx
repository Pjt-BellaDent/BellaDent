import React from 'react';
import styled from '@emotion/styled';

const CalendarWrapper = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const EventWrapper = styled.div`
  overflow-y: auto;
  max-height: 60px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;

  .left, .right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .month {
    font-weight: bold;
    font-size: 16px;
    color: #222;
  }

  button {
    background: none;
    border: none;
    color: #007bff;
    font-weight: 500;
    cursor: pointer;
  }

  select {
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background: #fff;
  }
`;

const DaysHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  background: #f1f3f5;
  padding: 10px 0;
  font-weight: bold;
  color: #444;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 100px;
`;

const Cell = styled.div`
  border: 1px solid #eee;
  padding: 6px 8px;
  position: relative;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const DayNumber = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
`;

const Entry = styled.div`
  font-size: 12px;
  margin-bottom: 4px;
  padding: 2px 6px;
  background: #e9f5ff;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

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
    cells.push(<Cell key={`empty-${i}`} />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    let daySchedules = scheduleData[key] || [];

    if (filterRank !== '전체') {
      daySchedules = daySchedules.filter(e => e.rank === filterRank);
    }

    const sorted = [...daySchedules].sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));

    cells.push(
      <Cell key={key} onClick={() => onDateClick(year, month, day)}>
        <DayNumber>{day}</DayNumber>
        <EventWrapper>
          {sorted.map((e, i) => (
            <Entry key={i}>
              • {`${e.time || ''} ${e.rank || ''} ${e.name || ''}`}
            </Entry>
          ))}
        </EventWrapper>
      </Cell>
    );
  }

  return (
    <CalendarWrapper>
      <Header>
        <div className="left">
          <button onClick={onPrevMonth}>⬅ 이전</button>
          <button onClick={onNextMonth}>다음 ➡</button>
        </div>
        <div className="month">
          {year}년 {month + 1}월
        </div>
        <div className="right">
          <select value={filterRank} onChange={onFilterChange}>
            <option value="전체">전체</option>
            <option value="원장">원장</option>
            <option value="스탭">스탭</option>
            <option value="위생사">위생사</option>
          </select>

        </div>
      </Header>

      <DaysHeader>
        {['일', '월', '화', '수', '목', '금', '토'].map(d => <div key={d}>{d}</div>)}
      </DaysHeader>
      <Grid>{cells}</Grid>
    </CalendarWrapper>
  );
};

export default ScheduleCalendar;
