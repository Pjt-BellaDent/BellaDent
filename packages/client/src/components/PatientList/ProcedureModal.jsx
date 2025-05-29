import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { fetchProceduresByName, addProcedure } from '../../api/patients';

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
  const [procedures, setProcedures] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', doctor: '', note: '' });

  useEffect(() => {
    if (!open || !patientName) return;
    const loadData = async () => {
      try {
        const data = await fetchProceduresByName(patientName);
        setProcedures(data);
      } catch (err) {
        console.error("시술 이력 로딩 실패", err);
      }
    };
    loadData();
  }, [open, patientName]);

  const handleAdd = async () => {
    if (!formData.title || !formData.date || !formData.doctor) {
      alert("시술명, 날짜, 의료진을 모두 입력해주세요.");
      return;
    }
    try {
      const newEntry = { ...formData, name: patientName };
      await addProcedure(newEntry);
      setProcedures([newEntry, ...procedures]);
      setFormData({ title: '', date: '', doctor: '', note: '' });
      setShowForm(false);
    } catch (err) {
      console.error("시술 추가 실패", err);
      alert("시술 추가에 실패했습니다.");
    }
  };

  return (
    <ModalOverlay open={open} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <h3>{patientName} 시술 이력</h3>

        <Timeline>
          {procedures.length === 0 ? (
            <p>등록된 시술 이력이 없습니다.</p>
          ) : (
            procedures.map((p, i) => (
              <Entry key={i}>
                <h4>{p.title}</h4>
                <div className="date">{new Date(p.date).toLocaleString('ko-KR')} / {p.doctor}</div>
                <div className="note">{p.note}</div>
              </Entry>
            ))
          )}
        </Timeline>

        <AddButton onClick={() => setShowForm(!showForm)}>
          {showForm ? '입력 취소' : '+ 시술 추가'}
        </AddButton>

        {showForm && (
          <Form>
            <input placeholder="시술명 예: 라미네이트" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            <input
              type="datetime-local"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
            />
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
