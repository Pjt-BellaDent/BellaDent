import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const Overlay = styled.div`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Modal = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 280px;
`;

const Field = styled.div`
  margin-bottom: 12px;

  label {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
  }

  input {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  button {
    padding: 8px 14px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .save {
    background: #007bff;
    color: white;
  }

  .cancel {
    background: #6c757d;
    color: white;
  }
`;

const SchedulePopup = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({ name: '', time: '' });

  useEffect(() => {
    if (open) {
      setForm({ name: '', time: '' });
    }
  }, [open]);

  const handleSubmit = () => {
    if (!form.name || !form.time) {
      alert('의료진 이름과 시간을 입력해주세요.');
      return;
    }
    onSave(form);
  };

  return (
    <Overlay open={open} onClick={e => e.target === e.currentTarget && onClose()}>
      <Modal>
        <h3>스케줄 추가</h3>

        <Field>
          <label>의료진 이름</label>
          <input
            type="text"
            placeholder="예: 김치과"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </Field>

        <Field>
          <label>시간</label>
          <input
            type="time"
            value={form.time}
            onChange={e => setForm({ ...form, time: e.target.value })}
          />
        </Field>

        <ButtonRow>
          <button className="save" onClick={handleSubmit}>등록</button>
          <button className="cancel" onClick={onClose}>취소</button>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
};

export default SchedulePopup;
