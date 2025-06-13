import React, { useState } from 'react';
import styled from '@emotion/styled';

const ModalOverlay = styled.div`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;

  textarea {
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  label {
    margin-right: 10px;
  }

  button {
    margin-top: 16px;
    padding: 8px 16px;
    background: #007bff;
    border: none;
    color: white;
    border-radius: 4px;
    cursor: pointer;
  }
`;

// patientName → patient 객체({ name, birth })로 받는 게 안전!
const SurveyModal = ({ open, onClose, patient }) => {
  const [form, setForm] = useState({
    q1: '3', q2: '3', q3: '3', comment: ''
  });

  const handleSubmit = () => {
    if (!patient || !patient.name || !patient.birth) {
      alert("환자 정보(이름, 생년월일)가 없습니다.");
      return;
    }

    const data = {
      name: patient.name,
      birth: patient.birth,
      ...form,
      date: new Date().toISOString().slice(0, 10)
    };

    const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
    surveys.push(data);
    localStorage.setItem('surveys', JSON.stringify(surveys));

    alert('설문이 저장되었습니다. 감사합니다!');
    onClose();
  };

  return (
    <ModalOverlay open={open} onClick={e => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <h3>
          📝 진료 만족도 조사 - {patient
            ? `${patient.name} (${patient.birth})`
            : '환자 정보 없음'}
        </h3>

        <p>1. 의료진의 설명이 충분했나요?</p>
        {[1,2,3,4,5].map(val => (
          <label key={`q1-${val}`}>
            <input
              type="radio"
              name="q1"
              value={val}
              checked={form.q1 === String(val)}
              onChange={e => setForm({ ...form, q1: e.target.value })}
            /> {val}점
          </label>
        ))}

        <p>2. 대기 시간은 어땠나요?</p>
        {[1,2,3,4,5].map(val => (
          <label key={`q2-${val}`}>
            <input
              type="radio"
              name="q2"
              value={val}
              checked={form.q2 === String(val)}
              onChange={e => setForm({ ...form, q2: e.target.value })}
            /> {val}점
          </label>
        ))}

        <p>3. 전반적인 만족도는?</p>
        {[1,2,3,4,5].map(val => (
          <label key={`q3-${val}`}>
            <input
              type="radio"
              name="q3"
              value={val}
              checked={form.q3 === String(val)}
              onChange={e => setForm({ ...form, q3: e.target.value })}
            /> {val}점
          </label>
        ))}

        <textarea
          name="comment"
          placeholder="의견을 적어주세요"
          value={form.comment}
          onChange={e => setForm({ ...form, comment: e.target.value })}
        />

        <button onClick={handleSubmit}>제출</button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SurveyModal;
