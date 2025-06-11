import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import CalendarPanel from './CalendarPanel';
import ReservationTimeTable from './ReservationTimeTable';
import ReservationModal from './ReservationModal';
import {
  fetchAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../../api/appointments';

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

  const getDateStr = (date) =>
    date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      : '';

  const getMonthStr = (date) =>
    date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : '';

  const fetchEvents = async () => {
    try {
      const month = getMonthStr(selectedDate);
      const data = await fetchAppointments(month);
      const grouped = {};
      data.forEach(item => {
        const dateKey = item.date;
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(item);
      });
      setEvents(grouped);
    } catch (err) {
      console.error('예약 불러오기 실패', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedDate]);

  const handleSave = async (formData) => {
    try {
      if (editData?.id) {
        await updateAppointment(editData.id, formData);
      } else {
        await createAppointment(formData);
      }
      setModalOpen(false);
      setEditData(null);
      fetchEvents();
    } catch (err) {
      console.error('저장 실패', err);
    }
  };

  const handleEditClick = (eventData) => {
    setEditData(eventData);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await deleteAppointment(id);
      fetchEvents();
    } catch (err) {
      alert('삭제 실패');
    }
  };

  const handleAdd = (prefill = {}) => {
    setEditData({
      department: prefill.department || '',
      date: getDateStr(selectedDate),
      startTime: prefill.startTime || '',
      endTime: prefill.endTime || '',
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
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSave={handleSave}
        initialData={editData}
        selectedDate={dateStr}
        eventsForDate={events[dateStr] || []}
      />
    </FlexWrap>
  );
};

export default ReservationManager;
