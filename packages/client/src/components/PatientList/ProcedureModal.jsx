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
`;

const Timeline = styled.div`
  margin-top: 20px;
  border-left: 4px solid #007bff;
  padding-left: 20px;
`;

const Entry = styled.div`
  margin-bottom: 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -12px;
    top: 4px;
    width: 14px;
    height: 14px;
    background: #007bff;
    border-radius: 50%;
  }

  h4 {
    margin: 0;
    font-size: 16px;
    color: #007bff;
  }

  .date {
    font-size: 13px;
    color: #666;
  }

  .note {
    margin-top: 6px;
    background: #f9f9f9;
    padding: 10px;
    border-radius: 6px;
  }
`;

const AddButton = styled.button`
  background: #28a745;
  color: white;
  padding: 10px 16px;
  margin-top: 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
`;

const Form = styled.div`
  margin-top: 20px;

  input, textarea {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  button {
    padding: 8px 12px;
    margin-right: 10px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }

  .submit { background-color: #007bff; color: white; }
  .cancel { background-color: #6c757d; color: white; }
`;

const ProcedureModal = ({ open, onClose, patientName }) => {
  const [procedures, setProcedures] = useState([
    { title: '라미네이트', date: '2025-04-02', doctor: '김치과', note: '앞니 6개 시술, 밝기 톤 조정' },
    { title: '스케일링', date: '2025-01-20', doctor: '홍의사', note: '치석 제거, 잇몸 출혈 있음' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', doctor: '', note: '' });

  const handleAdd = () => {
    const { title, date, doctor, note } = formData;
    if (!title || !date || !doctor || !note) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    setProcedures([{ title, date, doctor, note }, ...procedures]);
    setFormData({ title: '', date: '', doctor: '', note: '' });
    setShowForm(false);
  };

  return (
    <ModalOverlay open={open} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <h3>{patientName} 시술 이력</h3>

        <Timeline>
          {procedures.map((p, i) => (
            <Entry key={i}>
              <h4>{p.title}</h4>
              <div className="date">{p.date} / {p.doctor}</div>
              <div className="note">{p.note}</div>
            </Entry>
          ))}
        </Timeline>

        <AddButton onClick={() => setShowForm(!showForm)}>+ 시술 추가</AddButton>

        {showForm && (
          <Form>
            <input placeholder="시술명 예: 라미네이트" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
            <input placeholder="담당의 예: 김치과" value={formData.doctor} onChange={e => setFormData({ ...formData, doctor: e.target.value })} />
            <textarea placeholder="시술 메모 또는 설명" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })}></textarea>
            <button className="submit" onClick={handleAdd}>추가</button>
            <button className="cancel" onClick={() => setShowForm(false)}>취소</button>
          </Form>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProcedureModal;
