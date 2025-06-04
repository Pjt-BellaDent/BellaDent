import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { updatePatient } from '../../api/patients';

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
  input, select, textarea {
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
  // patientData는 { id, name, birth, ... } 형태로 들어오는 게 안전!
  const [form, setForm] = useState({ ...patientData });
  const [editedProcedures, setEditedProcedures] = useState([...procedures]);

  // patientData 변경 시 state도 반영 (모달 재진입 시 정상동작)
  useEffect(() => {
    setForm({ ...patientData });
    setEditedProcedures([...procedures]);
  }, [patientData, procedures]);

  const updateProcedure = (index, key, value) => {
    const newList = [...editedProcedures];
    newList[index][key] = value;
    setEditedProcedures(newList);
  };

  const handleSave = async () => {
    try {
      await updatePatient(form.id, {
        ...form,
        // 시술이력에 name+birth 모두 포함
        procedures: editedProcedures.map(proc => ({
          ...proc,
          name: form.name,
          birth: form.birth,
        })),
        lastVisit: form.lastVisit || new Date().toISOString().slice(0, 10)
      });
      alert('환자 정보가 저장되었습니다.');
      onClose();
    } catch (err) {
      console.error("저장 실패:", err);
      alert('저장에 실패했습니다.');
    }
  };

  return (
    <ModalBackground open={open}>
      <ModalBox>
        <h3>환자 정보 수정</h3>
        <label>이름</label>
        <input value={form.name} disabled />

        <label>생년월일</label>
        <input value={form.birth || ''} disabled />

        <label>성별</label>
        <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
          <option value="">선택</option>
          <option value="남">남</option>
          <option value="여">여</option>
        </select>

        {/* 나이는 DB 자동계산 추천, 없으면 입력란 유지 */}
        <label>나이</label>
        <input value={form.age || ''} onChange={e => setForm({ ...form, age: e.target.value })} />

        <label>전화번호</label>
        <input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />

        <label>진료과</label>
        <input value={form.dept || ''} onChange={e => setForm({ ...form, dept: e.target.value })} />

        <label>상태</label>
        <select value={form.status || ''} onChange={e => setForm({ ...form, status: e.target.value })}>
          <option value="">선택</option>
          <option value="예약">예약</option>
          <option value="대기">대기</option>
          <option value="진료완료">진료완료</option>
        </select>

        <h4>과거 시술 이력</h4>
        {editedProcedures.map((proc, i) => (
          <div key={i}>
            <label>시술명</label>
            <input value={proc.title} onChange={e => updateProcedure(i, 'title', e.target.value)} />
            <label>날짜</label>
            <input
              type="datetime-local"
              value={proc.date}
              onChange={e => updateProcedure(i, 'date', e.target.value)}
            />
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
