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
  width: 300px;
`;

const Field = styled.div`
  margin-bottom: 12px;

  label {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
  }

  input, select, textarea {
    width: 100%;
    padding: 6px;
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  textarea {
    height: 60px;
    resize: vertical;
  }
`;

const CheckboxField = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;

  input {
    margin-right: 6px;
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

const SchedulePopup = ({ open, onClose, onSave, initialData = null }) => {
  const [form, setForm] = useState({
    rank: '',
    name: '',
    time: '',
    memo: '',
    off: false
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ rank: '', name: '', time: '', memo: '', off: false });
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    if (!form.rank || !form.name || !form.time) {
      alert('직급, 이름, 시간을 모두 입력해주세요.');
      return;
    }

    onSave(form); // 백엔드 등록 or 수정은 상위에서 판단
  };

  return (
    <Overlay open={open} onClick={e => e.target === e.currentTarget && onClose()}>
      <Modal>
        <h3>{initialData ? '스케줄 수정' : '스케줄 등록'}</h3>

        <Field>
          <label>직급</label>
          <select value={form.rank} onChange={e => setForm({ ...form, rank: e.target.value })}>
            <option value="">선택</option>
            <option value="원장">원장</option>
            <option value="부원장">부원장</option>
            <option value="과장">과장</option>
            <option value="상담사">상담사</option>
            <option value="수납">수납</option>
            <option value="치위생사">치위생사</option>
          </select>
        </Field>

        <Field>
          <label>이름</label>
          <input
            type="text"
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

        <Field>
          <label>메모</label>
          <textarea
            value={form.memo}
            onChange={e => setForm({ ...form, memo: e.target.value })}
          />
        </Field>

        <CheckboxField>
          <input
            type="checkbox"
            checked={form.off}
            onChange={e => setForm({ ...form, off: e.target.checked })}
          />
          <label>휴무</label>
        </CheckboxField>

        <ButtonRow>
          <button className="save" onClick={handleSubmit}>
            {initialData ? '수정' : '등록'}
          </button>
          <button className="cancel" onClick={onClose}>취소</button>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
};

export default SchedulePopup;
