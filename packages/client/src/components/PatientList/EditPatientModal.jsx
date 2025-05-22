import React, { useState } from 'react';
import styled from '@emotion/styled';

const ModalBackground = styled.div`
  display: ${({ open }) => open ? 'flex' : 'none'};
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.4);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: white;
  padding: 24px;
  border-radius: 10px;
  width: 600px;
  max-height: 90vh;
  overflow-y: auto;

  h3 { margin-top: 0; }
  label { display: block; margin: 10px 0 5px; }
  input, textarea {
    width: 100%;
    padding: 8px;
    margin-bottom: 12px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
`;

const ButtonRow = styled.div`
  text-align: right;
  button {
    padding: 8px 12px;
    margin-left: 10px;
    border-radius: 4px;
    cursor: pointer;
    border: none;
  }
  .save { background: #007bff; color: white; }
  .cancel { background: #ccc; }
`;

const EditPatientModal = ({ open, onClose, patientData, procedures }) => {
  const [form, setForm] = useState({ ...patientData });
  const [editedProcedures, setEditedProcedures] = useState([...procedures]);

  const updateProcedure = (index, key, value) => {
    const newList = [...editedProcedures];
    newList[index][key] = value;
    setEditedProcedures(newList);
  };

  const handleSave = () => {
    console.log('✔️ 저장된 정보:', form, editedProcedures);
    onClose(); // 실제 저장 로직은 서버 연동 시 구현
  };

  return (
    <ModalBackground open={open}>
      <ModalBox>
        <h3>환자 정보 수정</h3>

        <label>이름</label>
        <input value={form.name} disabled />

        <label>성별</label>
        <input value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} />

        <label>나이</label>
        <input value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />

        <label>전화번호</label>
        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />

        <label>진료과</label>
        <input value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })} />

        <h4>과거 시술 이력</h4>
        {editedProcedures.map((proc, i) => (
          <div key={i}>
            <label>시술명</label>
            <input value={proc.title} onChange={e => updateProcedure(i, 'title', e.target.value)} />
            <label>날짜</label>
            <input type="date" value={proc.date} onChange={e => updateProcedure(i, 'date', e.target.value)} />
            <label>의료진</label>
            <input value={proc.doctor} onChange={e => updateProcedure(i, 'doctor', e.target.value)} />
            <label>비고</label>
            <textarea value={proc.note} onChange={e => updateProcedure(i, 'note', e.target.value)} />
            <hr />
          </div>
        ))}

        <ButtonRow>
          <button className="cancel" onClick={onClose}>취소</button>
          <button className="save" onClick={handleSave}>저장</button>
        </ButtonRow>
      </ModalBox>
    </ModalBackground>
  );
};

export default EditPatientModal;
