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
  width: 340px;

  h3 {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-top: 10px;
    margin-bottom: 5px;
    font-size: 14px;
  }

  input, select, textarea {
    width: 100%;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  textarea {
    height: 60px;
    resize: vertical;
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

const ReservationModal = ({ open, onClose, onSave, initialData = null }) => {
  const [form, setForm] = useState({
    time: '',
    type: '',
    name: '',
    memo: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleSubmit = () => {
    const { time, type, name } = form;
    if (!time || !type || !name) {
      alert('시간, 진료과, 환자 이름을 모두 입력해주세요.');
      return;
    }

    onSave(form);
    onClose();
  };

  return (
    <ModalOverlay open={open} onClick={e => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <h3>{initialData ? '예약 수정' : '예약 등록'}</h3>

        <label>시간</label>
        <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />

        <label>진료과</label>
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option value="">선택</option>
          <option value="보철과">보철과</option>
          <option value="교정과">교정과</option>
          <option value="잇몸클리닉">잇몸클리닉</option>
        </select>

        <label>환자 이름</label>
        <input type="text" placeholder="예: 홍길동" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

        <label>메모</label>
        <textarea placeholder="추가 메모" value={form.memo} onChange={e => setForm({ ...form, memo: e.target.value })} />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="save-btn" onClick={handleSubmit}>
            {initialData ? '수정' : '등록'}
          </button>
          <button className="close-btn" onClick={onClose}>취소</button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ReservationModal;
