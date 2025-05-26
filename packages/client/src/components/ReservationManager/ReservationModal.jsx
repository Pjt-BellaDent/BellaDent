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

const ReservationModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState({
    time: '',
    type: '',
    name: '',
    memo: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        time: initialData.time || '',
        type: initialData.type || '',
        name: initialData.name || '',
        memo: initialData.memo || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { time, type, name, memo } = form;
    if (!time || !type || !name) {
      alert('시간, 진료과, 환자 이름을 모두 입력해주세요.');
      return;
    }

    const payload = {
      time,
      department: type, // ✅ 서버 필드에 맞게 변환
      name,
      memo
    };

    onSave(payload);
    onClose();
  };

  return (
    <ModalBackground open={open}>
      <ModalBox>
        <h3>예약 {initialData ? '수정' : '등록'}</h3>

        <Field>
          <label>시간</label>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
          />
        </Field>

        <Field>
          <label>진료과</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="">선택</option>
            <option value="보철과">보철과</option>
            <option value="교정과">교정과</option>
            <option value="잇몸클리닉">잇몸클리닉</option>
          </select>
        </Field>

        <Field>
          <label>환자 이름</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </Field>

        <Field>
          <label>메모</label>
          <textarea
            name="memo"
            value={form.memo}
            onChange={handleChange}
          />
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
