import React from 'react';
import styled from '@emotion/styled';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Wrapper = styled.div`
  width: 320px;
  background: #1a1b1d;
  color: #fff;
  border-radius: 13px;
  padding: 18px 18px 20px 18px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
`;
const CalendarWrapper = styled.div`
  .react-calendar { background: transparent; border: none; }
  .react-calendar__tile--active { background: #2071e5; color: #fff; border-radius: 7px; }
  .react-calendar__tile--now {
    background: #24335a !important;
    color: #fff !important;
    border-radius: 7px;
  }
`;
const DateText = styled.div`
  font-weight: bold;
  font-size: 17px;
  margin: 16px 0 10px 0;
`;
const EventList = styled.ul`
  list-style: none;
  padding: 0; margin: 0;
`;
const EventItem = styled.li`
  font-size: 15px;
  background: #232438;
  margin-bottom: 6px;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  .dot { width: 9px; height: 9px; border-radius: 100%; display: inline-block; background: #41c5f2; }
`;
const BadgeWrap = styled.div`
  margin: 4px 0 8px 0;
  font-size: 13px;
  min-height: 20px;
`;
const Badge = styled.span`
  display: inline-block;
  background: ${p => p.color || '#ccc'};
  color: #fff;
  border-radius: 8px;
  padding: 2px 10px;
  font-weight: 600;
  margin-right: 8px;
  font-size: 13px;
  letter-spacing: 1px;
`;

const koreanWeekdays = ['일', '월', '화', '수', '목', '금', '토'];
const pad = n => String(n).padStart(2, '0');
const getDateStr = date =>
  date
    ? `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`
    : '';

const departments = [
  { name: '보철과', color: '#3cc441' },
  { name: '교정과', color: '#f5433a' },
  { name: '치주과', color: '#1794f7' },
];
const times = ['10:00','11:00','13:00','14:00','15:00','16:00','17:00'];

function CalendarPanel({ selectedDate, onDateChange, events }) {
  const dateStr = getDateStr(selectedDate);
  const todayEvents = events[dateStr] || [];

  // 과별 마감(달력 아래 표시용)
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
    <Wrapper>
      <CalendarWrapper>
        <Calendar
          value={selectedDate}
          onChange={onDateChange}
          locale="en-US"
          formatMonthYear={(locale, date) =>
            `${date.getFullYear()}년 ${date.getMonth() + 1}월`
          }
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
              <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
                {closedDeptsForDay.map(d => (
                  <span
                    key={d.name}
                    style={{
                      width: 7, height: 7, borderRadius: '100%',
                      background: d.color, display: 'inline-block'
                    }}
                    title={`${d.name} 마감`}
                  />
                ))}
              </div>
            );
          }}
        />
      </CalendarWrapper>
      <BadgeWrap>
        {closedDepts.map(d => (
          <Badge key={d.name} color={d.color}>
            {d.name} 마감
          </Badge>
        ))}
      </BadgeWrap>
      <DateText>{dateStr || '일자 선택'}</DateText>
      <EventList>
        {todayEvents.length === 0 ? (
          <li style={{color:'#aaa'}}>예약 없음</li>
        ) : todayEvents
          .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
          .map(e => (
            <EventItem key={e.id || (e.name + e.birth + e.startTime)}>
              <span className="dot" />
              {e.startTime}
              {e.endTime && e.startTime !== e.endTime ? `~${e.endTime}` : ''}
              <span style={{ marginLeft: 5 }}>
                {e.name}
                {e.birth && (
                  <span style={{ fontSize: 13, color: '#888', marginLeft: 3 }}>
                    ({e.birth})
                  </span>
                )}
              </span>
              <span style={{fontSize:13, color:'#47a3ef'}}>{e.department}</span>
            </EventItem>
        ))}
      </EventList>
    </Wrapper>
  );
}

export default CalendarPanel;
