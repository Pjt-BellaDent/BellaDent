// CalendarGrid.jsx — 전체필터에서도 각 진료과별 마감상태 아이콘/텍스트 표시
import React, { useState } from 'react';
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
  grid-auto-rows: 110px;
`;
const Cell = styled.div`
  border: 1px solid #eee;
  padding: 6px 8px;
  position: relative;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 13px;
  background: ${({ disabled }) => (disabled ? '#f7f7fa' : 'white')};
  color: ${({ disabled }) => (disabled ? '#999' : '#222')};
  opacity: ${({ disabled }) => (disabled ? 0.8 : 1)};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const DayNumber = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
`;
const Event = styled.div`
  font-size: 13px;
  color: #333;
  line-height: 1.6;
`;
const ClosedMark = styled.div`
  margin-top: 8px;
  font-size: 13px;
  font-weight: bold;
  color: #dc3545;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;
const SubClosed = styled.span`
  font-size: 12px;
  color: #dc3545;
  background: #ffe5e9;
  border-radius: 5px;
  padding: 1px 7px;
  margin-top: 3px;
  margin-right: 4px;
`;

const HOUR_MAP = {
  '보철과': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
  '교정과': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  '치주과': ['09:00', '10:00', '14:00', '15:00', '16:00'],
};
const DEPT_LIST = ['보철과', '교정과', '치주과'];

const CalendarGrid = ({
  currentDate,
  events = {},
  onChangeMonth,
  onSelectDate,
  onAdd,
  onEdit,
  onDelete
}) => {
  const [filterDept, setFilterDept] = useState('전체');
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
    const dayEvents = Array.isArray(events[key]) ? events[key] : [];

    let isClosed = false;
    let sortedEvents = [];
    let deptClosed = {};
    if (filterDept === '전체') {
      // 과별 마감상태 모두 계산
      deptClosed = Object.fromEntries(DEPT_LIST.map(dept => [dept, dayEvents.filter(e => e.department === dept).length >= HOUR_MAP[dept].length]));
      isClosed = Object.values(deptClosed).every(v => v);
      sortedEvents = [...dayEvents].sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));
    } else {
      deptClosed = {[filterDept]: dayEvents.filter(e => e.department === filterDept).length >= HOUR_MAP[filterDept].length};
      isClosed = deptClosed[filterDept];
      sortedEvents = [...dayEvents.filter(e => e.department === filterDept)].sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));
    }

    cells.push(
      <Cell
        key={key}
        disabled={isClosed}
        onClick={() => {
          if (!isClosed) {
            onSelectDate(key);
            onAdd();
          }
        }}
      >
        <DayNumber>{day}</DayNumber>
        <EventWrapper>
          {sortedEvents.map((e, i) => (
            <Event
              key={i}
              onClick={(event) => {
                event.stopPropagation();
                if (!isClosed) {
                  onSelectDate(key);
                  onEdit(e);
                }
              }}
            >
              • {`${e.time || ''} ${e.name || '-'} (${e.department || '진료과'})`}
            </Event>
          ))}
        </EventWrapper>
        {/* 전체일 때, 마감된 과별 태그를 함께 표기 */}
        {filterDept === '전체' && Object.entries(deptClosed).some(([_, v]) => v) && (
          <ClosedMark>
            {DEPT_LIST.map(dept => deptClosed[dept] && <SubClosed key={dept}>{dept} 마감</SubClosed>)}
          </ClosedMark>
        )}
        {/* 해당과만 볼 때는 기존처럼 단일 마감만 */}
        {filterDept !== '전체' && isClosed && <ClosedMark>마감</ClosedMark>}
      </Cell>
    );
  }

  return (
    <CalendarWrapper>
      <Header>
        <div className="left">
          <button onClick={() => onChangeMonth(-1)}>⬅ 이전</button>
          <button onClick={() => onChangeMonth(1)}>다음 ➡</button>
        </div>
        <div className="month">
          {year}년 {month + 1}월
        </div>
        <div className="right">
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)}>
            <option value="전체">전체</option>
            {DEPT_LIST.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </Header>
      <DaysHeader>
        {['일', '월', '화', '수', '목', '금', '토'].map(d => (
          <div key={d}>{d}</div>
        ))}
      </DaysHeader>
      <Grid>{cells}</Grid>
    </CalendarWrapper>
  );
};

export default CalendarGrid;
