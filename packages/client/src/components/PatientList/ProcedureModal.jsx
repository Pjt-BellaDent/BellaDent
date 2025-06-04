import React, { useEffect, useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { fetchProceduresByName, addProcedure, addAppointment } from '../../api/patients';

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
  input, select, textarea {
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
const TimeButton = styled.button`
  background: ${({ active, disabled }) =>
    disabled ? '#ececec'
    : active ? '#2071e5'
    : '#f7fafd'};
  color: ${({ active, disabled }) =>
    disabled ? '#bcbcbc'
    : active ? '#fff'
    : '#333'};
  border: none;
  border-radius: 7px;
  font-size: 15px;
  padding: 10px 18px;
  margin: 4px 10px 4px 0;
  font-weight: 600;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: 0.1s;
`;
const departments = ['보철과', '교정과', '치주과'];
const HOUR_MAP = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const splitAmPm = (list) => ({
  am: list.filter(h => +h.split(':')[0] < 12),
  pm: list.filter(h => +h.split(':')[0] >= 12)
});

const ProcedureModal = ({ open, onClose, patient, events = {}, fetchEvents }) => {
  const [procedures, setProcedures] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    doctor: '',
    note: '',
    department: '',
    time: ''
  });

  // 예약된 시간 계산 (ReservationModal과 동일)
  const reservedTimes = useMemo(() => {
    if (!formData.department || !formData.date || !Array.isArray(events[formData.date])) return [];
    return events[formData.date]
      .filter(e => e.department === formData.department)
      .flatMap(e => {
        if (!e.time) return [];
        if (e.time.includes('~')) {
          const [start, end] = e.time.split('~');
          const idxStart = HOUR_MAP.indexOf(start);
          const idxEnd = HOUR_MAP.indexOf(end);
          return HOUR_MAP.slice(idxStart, idxEnd + 1);
        }
        if (e.time.includes(',')) return e.time.split(',');
        return [e.time];
      });
  }, [formData.department, formData.date, events]);

  const { am, pm } = splitAmPm(HOUR_MAP);

  // 시술 이력 로딩
  useEffect(() => {
    if (!open || !patient?.name || !patient?.birth) return;
    const loadData = async () => {
      try {
        const data = await fetchProceduresByName(patient.name, patient.birth);
        setProcedures(data);
      } catch (err) {
        console.error("시술 이력 로딩 실패", err);
      }
    };
    loadData();
  }, [open, patient]);

  const handleAdd = async () => {
    const { title, date, doctor, department, time } = formData;
    if (!title.trim() || !date || !doctor.trim() || !department || !time) {
      alert("모든 필수 입력값을 채워주세요!");
      return;
    }
    const newEntry = {
      ...formData,
      name: patient.name,
      birth: patient.birth
    };
    try {
      await addProcedure(newEntry);
      try {
        await addAppointment({
          name: patient.name,
          birth: patient.birth,
          reservationDate: date,
          time,
          department,
          doctor,
          memo: formData.note,
          phone: patient.phone || '-',
          gender: patient.gender || '-',
          status: "대기" // 상태 고정
        });
      } catch (err) {
        alert("예약 등록에 실패했습니다.\n(이미 예약된 시간일 수 있습니다.)");
      }
      setProcedures([newEntry, ...procedures]);
      setFormData({
        title: '',
        date: '',
        doctor: '',
        note: '',
        department: '',
        time: ''
      });
      setShowForm(false);
      // ---- 예약 정보 events 최신화! ----
      if (fetchEvents) fetchEvents();
      // ---- 임시 강제 새로고침 (테스트/임시)
      // window.location.reload();
    } catch (err) {
      console.error("시술 추가 실패", err);
      alert("시술 추가에 실패했습니다.");
    }
  };

  return (
    <ModalOverlay open={open} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <h3>
          {patient ? `${patient.name} (${patient.birth}) 시술 이력` : ''}
        </h3>
        <Timeline>
          {procedures.length === 0 ? (
            <p>등록된 시술 이력이 없습니다.</p>
          ) : (
            procedures.map((p, i) => (
              <Entry key={i}>
                <h4>{p.title}</h4>
                <div className="date">
                  {new Date(p.date).toLocaleString('ko-KR')} / {p.doctor} / {p.department} / {p.time}
                </div>
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
            <select
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value, time: '' })}
            >
              <option value="">진료과 선택</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value, time: '' })}
            />
            {formData.department && formData.date && (
              <>
                {am.length > 0 && <div style={{ margin: '10px 0 2px 0', fontWeight: 600, color: '#007bff' }}>오전</div>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
                  {am.map(t => (
                    <TimeButton
                      key={t}
                      type="button"
                      disabled={reservedTimes.includes(t)}
                      active={formData.time === t}
                      onClick={() => !reservedTimes.includes(t) && setFormData({ ...formData, time: t })}
                    >
                      {t}
                    </TimeButton>
                  ))}
                </div>
                {pm.length > 0 && <div style={{ margin: '10px 0 2px 0', fontWeight: 600, color: '#007bff' }}>오후</div>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
                  {pm.map(t => (
                    <TimeButton
                      key={t}
                      type="button"
                      disabled={reservedTimes.includes(t)}
                      active={formData.time === t}
                      onClick={() => !reservedTimes.includes(t) && setFormData({ ...formData, time: t })}
                    >
                      {t}
                    </TimeButton>
                  ))}
                </div>
              </>
            )}
            <input
              placeholder="시술명 예: 라미네이트"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            <input
              placeholder="담당의 예: 김치과"
              value={formData.doctor}
              onChange={e => setFormData({ ...formData, doctor: e.target.value })}
            />
            <textarea
              placeholder="시술 메모 또는 설명"
              value={formData.note}
              onChange={e => setFormData({ ...formData, note: e.target.value })}
            ></textarea>
            <button className="submit" type="button" onClick={handleAdd}>추가</button>
            <button className="cancel" type="button" onClick={() => setShowForm(false)}>취소</button>
          </Form>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProcedureModal;
