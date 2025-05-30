// ReservationModal.jsx — 생년월일 드롭다운 UI 적용, 나머지 카카오 예약 시간/중복방지 동일
import React, { useState, useEffect, useMemo } from 'react';
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

const BirthRow = styled.div`
  display: flex;
  gap: 6px;
  > select { flex: 1; }
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 10px;
`;
const TimeButton = styled.button`
  padding: 10px 0;
  border-radius: 7px;
  border: 1px solid ${({ selected }) => (selected ? '#007bff' : '#ccc')};
  background: ${({ selected }) => (selected ? '#007bff' : '#f5f5f5')};
  color: ${({ selected }) => (selected ? 'white' : '#222')};
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;
const AmPmLabel = styled.div`
  margin: 10px 0 2px 0;
  font-weight: 600;
  color: #007bff;
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

const HOUR_MAP = {
  '보철과': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
  '교정과': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  '치주과': ['09:00', '10:00', '14:00', '15:00', '16:00'],
  '': []
};
const splitAmPm = (list) => ({
  am: list.filter(h => +h.split(':')[0] < 12),
  pm: list.filter(h => +h.split(':')[0] >= 12)
});

// 드롭다운용 데이터 생성
const getYearList = (start=1920) => {
  const now = new Date().getFullYear();
  return Array.from({length: now-start+1}, (_,i)=>String(now-i));
};
const getMonthList = () => Array.from({length:12},(_,i)=>String(i+1).padStart(2,'0'));
const getDayList = (year, month) => {
  if (!year || !month) return Array.from({length:31},(_,i)=>String(i+1).padStart(2,'0'));
  const last = new Date(Number(year), Number(month), 0).getDate();
  return Array.from({length:last},(_,i)=>String(i+1).padStart(2,'0'));
};

const ReservationModal = ({ open, onClose, onSave, initialData, selectedDate, eventsForDate = [] }) => {
  const [form, setForm] = useState({
    name: '',
    birth: '',
    userId: '',
    reservationDate: '',
    time: '',
    department: '',
    memo: '',
    phone: '',
    gender: '',
    status: '대기'
  });

  // 생년월일 드롭다운 상태
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');

  // 예약 중복된 시간 목록 구하기
  const reservedTimes = useMemo(() => {
    if (!form.department || !form.reservationDate || !Array.isArray(eventsForDate)) return [];
    return eventsForDate
      .filter(e => e.department === form.department && e.reservationDate === form.reservationDate && (!initialData || initialData.time !== e.time))
      .map(e => e.time);
  }, [form.department, form.reservationDate, eventsForDate, initialData]);

  useEffect(() => {
    if (initialData) {
      const [yy, mm, dd] = (initialData.birth || '').split('-');
      setForm({
        name: initialData.name || '',
        birth: initialData.birth || '',
        userId: initialData.userId || '',
        reservationDate: initialData.reservationDate || '',
        time: initialData.time || '',
        department: initialData.department || '',
        memo: initialData.memo || initialData.notes || '',
        phone: initialData.phone || '',
        gender: initialData.gender || '',
        status: initialData.status || '대기'
      });
      setBirthYear(yy || ''); setBirthMonth(mm || ''); setBirthDay(dd || '');
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setForm(prev => ({
        ...prev,
        reservationDate: selectedDate || today,
        time: '',
        department: '',
      }));
      setBirthYear(''); setBirthMonth(''); setBirthDay('');
    }
  }, [initialData, selectedDate]);

  // 생년월일 값 동기화
  useEffect(() => {
    if (birthYear && birthMonth && birthDay) {
      setForm(prev => ({ ...prev, birth: `${birthYear}-${birthMonth}-${birthDay}` }));
    } else {
      setForm(prev => ({ ...prev, birth: '' }));
    }
  }, [birthYear, birthMonth, birthDay]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value, ...(name === 'department' ? { time: '' } : {}) }));
  };

  // 예약 시간 선택
  const handleTimeClick = (t) => {
    if (!reservedTimes.includes(t)) {
      setForm(prev => ({ ...prev, time: t }));
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.reservationDate || !form.time || !form.department) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }
    if (reservedTimes.includes(form.time)) {
      alert('이미 예약된 시간입니다. 다른 시간을 선택해주세요.');
      return;
    }
    const filledForm = {
      ...form,
      userId: form.userId || `${form.name}-${Date.now()}`
    };
    onSave(filledForm);
  };

  const departmentHours = HOUR_MAP[form.department] || [];
  const { am, pm } = splitAmPm(departmentHours);

  return (
    <ModalBackground open={open} onClick={e => e.target === e.currentTarget && onClose()}>
      <ModalBox>
        <h3>예약 {initialData ? '수정' : '등록'}</h3>
        <Field>
          <label>이름</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </Field>
        <Field>
          <label>생년월일</label>
          <BirthRow>
            <select value={birthYear} onChange={e => setBirthYear(e.target.value)}>
              <option value="">년</option>
              {getYearList().map(y=>(<option key={y} value={y}>{y}년</option>))}
            </select>
            <select value={birthMonth} onChange={e => setBirthMonth(e.target.value)}>
              <option value="">월</option>
              {getMonthList().map(m=>(<option key={m} value={m}>{m}월</option>))}
            </select>
            <select value={birthDay} onChange={e => setBirthDay(e.target.value)}>
              <option value="">일</option>
              {getDayList(birthYear, birthMonth).map(d=>(<option key={d} value={d}>{d}일</option>))}
            </select>
          </BirthRow>
        </Field>
        <Field>
          <label>연락처</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} />
        </Field>
        <Field>
          <label>성별</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">선택</option>
            <option value="남">남</option>
            <option value="여">여</option>
          </select>
        </Field>
        <Field>
          <label>예약일</label>
          <input type="date" name="reservationDate" value={form.reservationDate} onChange={handleChange} />
        </Field>
        <Field>
          <label>진료과</label>
          <select name="department" value={form.department} onChange={handleChange}>
            <option value="">선택</option>
            <option value="보철과">보철과</option>
            <option value="교정과">교정과</option>
            <option value="치주과">치주과</option>
          </select>
        </Field>
        {form.department && form.reservationDate && (
          <>
            {am.length > 0 && <AmPmLabel>오전</AmPmLabel>}
            <TimeGrid>
              {am.map(t => (
                <TimeButton
                  key={t}
                  type="button"
                  selected={form.time === t}
                  disabled={reservedTimes.includes(t)}
                  onClick={() => handleTimeClick(t)}
                >
                  {t}
                </TimeButton>
              ))}
            </TimeGrid>
            {pm.length > 0 && <AmPmLabel>오후</AmPmLabel>}
            <TimeGrid>
              {pm.map(t => (
                <TimeButton
                  key={t}
                  type="button"
                  selected={form.time === t}
                  disabled={reservedTimes.includes(t)}
                  onClick={() => handleTimeClick(t)}
                >
                  {t}
                </TimeButton>
              ))}
            </TimeGrid>
          </>
        )}
        <Field>
          <label>메모</label>
          <textarea name="memo" value={form.memo} onChange={handleChange} />
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
