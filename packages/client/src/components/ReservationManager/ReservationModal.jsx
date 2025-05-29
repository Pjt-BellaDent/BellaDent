import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const ModalBackground = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.4);
  display: ${({ open }) => (open ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: white;
  padding: 24px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
`;

const Field = styled.div`
  margin-bottom: 16px;
  label {
    display: block;
    font-size: 14px;
    margin-bottom: 6px;
  }

  input, select, textarea {
    width: 100%;
    padding: 8px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  textarea {
    resize: vertical;
    height: 60px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  button {
    padding: 6px 14px;
    font-size: 14px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
  }

  .save {
    background: #007bff;
    color: white;
  }

  .cancel {
    background: #ccc;
  }
`;

const ReservationModal = ({ open, onClose, onSave, initialData, selectedDate }) => {
  const [form, setForm] = useState({
    name: '',
    userId: '',
    reservationDate: '',
    time: '',
    department: '',
    memo: '', // notes -> memo로 변경
    phone: '',
    gender: '',
    status: '대기'
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        userId: initialData.userId || '',
        reservationDate: initialData.reservationDate || '',
        time: initialData.time || '',
        department: initialData.department || '',
        memo: initialData.memo || initialData.notes || '',
        phone: initialData.phone || '',
        gender: initialData.gender || '',
        status: initialData.status || '대기'
      });
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setForm(prev => ({
        ...prev,
        reservationDate: selectedDate || today
      }));
    }
  }, [initialData, selectedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.reservationDate || !form.time || !form.department) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }
    const filledForm = {
      ...form,
      userId: form.userId || `${form.name}-${Date.now()}`
    };
    onSave(filledForm);
  };

  return (
    <ModalBackground open={open} onClick={e => e.target === e.currentTarget && onClose()}>
      <ModalBox>
        <h3>예약 {initialData ? '수정' : '등록'}</h3>
        <Field>
          <label>이름</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </Field>
        <Field>
          <label>연락처</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} />
        </Field>
        <Field>
          <label>성별</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">선택</option>
            <option value="남">남</option>
            <option value="여">여</option>
          </select>
        </Field>
        <Field>
          <label>예약일</label>
          <input type="date" name="reservationDate" value={form.reservationDate} onChange={handleChange} />
        </Field>
        <Field>
          <label>시간</label>
          <input type="time" name="time" value={form.time} onChange={handleChange} />
        </Field>
        <Field>
          <label>진료과</label>
          <select name="department" value={form.department} onChange={handleChange}>
            <option value="">선택</option>
            <option value="보철과">보철과</option>
            <option value="교정과">교정과</option>
            <option value="치주과">치주과</option>
          </select>
        </Field>
        <Field>
          <label>메모</label>
          <textarea name="memo" value={form.memo} onChange={handleChange} />
        </Field>
        <ButtonRow>
          <button className="cancel" onClick={onClose}>취소</button>
          <button className="save" onClick={handleSubmit}>저장</button>
        </ButtonRow>
      </ModalBox>
    </ModalBackground>
  );
};

export default ReservationModal;
