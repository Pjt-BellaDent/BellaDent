import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const ModalOverlay = styled.div`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0,0,0,0.4);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;

  h3 {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-top: 10px;
    margin-bottom: 5px;
    font-size: 14px;
  }

  input {
    width: 100%;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    margin-top: 10px;
    padding: 6px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .save-btn {
    background: #007bff;
    color: white;
    margin-right: 10px;
  }

  .close-btn {
    background: #dc3545;
    color: white;
  }
`;

const ReservationModal = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({ time: '', type: '', doctor: '' });

  useEffect(() => {
    if (open) setForm({ time: '', type: '', doctor: '' });
  }, [open]);

  const handleSubmit = () => {
    const { time, type, doctor } = form;
    if (!time || !type.trim() || !doctor.trim()) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    onSave(form);
  };

  return (
    <ModalOverlay open={open} onClick={e => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <h3>예약 등록</h3>
        <label>시간</label>
        <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />

        <label>진료과</label>
        <input type="text" placeholder="예: 내과" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />

        <label>의사 이름</label>
        <input type="text" placeholder="예: 김의사" value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="save-btn" onClick={handleSubmit}>등록</button>
          <button className="close-btn" onClick={onClose}>취소</button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ReservationModal;
