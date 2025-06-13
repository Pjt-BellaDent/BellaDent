import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import CalendarPanel from './CalendarPanel';
import ReservationTimeTable from './ReservationTimeTable';
import ReservationModal from './ReservationModal';

const FlexWrap = styled.div`
  display: flex;
  gap: 32px;
  align-items: flex-start;
`;
const RightContent = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 14px;
  min-height: 550px;
  box-shadow: 0 2px 8px rgba(34,43,77,0.07);
  padding: 34px 36px 26px 36px;
`;

const ReservationManager = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // 날짜 YYYY-MM-DD
  const getDateStr = (date) =>
    date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      : '';

  // 월 YYYY-MM
  const getMonthStr = (date) =>
    date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : '';

  // 예약 데이터 불러오기
  const fetchEvents = async () => {
    try {
      const month = getMonthStr(selectedDate);
      const res = await fetch(`http://localhost:3000/appointments?month=${month}`);
      const data = await res.json();
      const grouped = {};
      data.forEach(item => {
        const dateKey = item.date; // ★ 반드시 date 필드 사용!
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(item);
      });
      setEvents(grouped);
    } catch (err) {
      console.error('예약 불러오기 실패', err);
    }
  };
  useEffect(() => { fetchEvents(); }, [selectedDate]);

  // 예약 저장
  const handleSave = async (formData) => {
    try {
      // 반드시 department, date, startTime, endTime 등 모두 포함
      const method = editData?.id ? 'PUT' : 'POST';
      const url = editData?.id
        ? `http://localhost:3000/appointments/${editData.id}`
        : `http://localhost:3000/appointments`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(await res.text());
      setModalOpen(false);
      setEditData(null);
      fetchEvents();
    } catch (err) { console.error('저장 실패', err); }
  };

  // 예약 수정
  const handleEditClick = (eventData) => {
    setEditData(eventData);
    setModalOpen(true);
  };
  // 예약 삭제
  const handleDelete = async (id) => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:3000/appointments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      fetchEvents();
    } catch (err) { alert('삭제 실패'); }
  };

  // 예약 등록(빠른등록 포함)
  const handleAdd = (prefill = {}) => {
    setEditData({
      department: prefill.department || '',
      date: getDateStr(selectedDate),
      startTime: prefill.startTime || '',
      endTime: prefill.endTime || '',
      // 추가로 필요한 필드(doctorId, title, 등) 있으면 여기에 넣어도 됨
    });
    setModalOpen(true);
  };

  const dateStr = getDateStr(selectedDate);

  return (
    <FlexWrap>
      <CalendarPanel
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        events={events}
      />
      <RightContent>
        <ReservationTimeTable
          date={dateStr}
          events={events}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </RightContent>
      <ReservationModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        onSave={handleSave}
        initialData={editData}
        selectedDate={dateStr}
        eventsForDate={events[dateStr] || []}
      />
    </FlexWrap>
  );
};

export default ReservationManager;
