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

const HOUR_MAP = ['10:00','11:00','13:00','14:00','15:00','16:00','17:00'];
const splitAmPm = (list) => ({
  am: list.filter(h => +h.split(':')[0] < 12),
  pm: list.filter(h => +h.split(':')[0] >= 12)
});

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

// 진료과별 시술명 매핑
const PROCEDURE_MAP = {
  '보철과': ['라미네이트', '임플란트', '올세라믹 크라운'],
  '교정과': ['클리피씨 교정', '투명교정', '설측교정'],
  '치주과': ['치석제거', '치근활택술', '치은성형술'],
};

const ReservationModal = ({ open, onClose, onSave, initialData, selectedDate, eventsForDate = [] }) => {
  const [form, setForm] = useState({
    name: '',
    birth: '',
    userId: '',
    reservationDate: '',
    time: '',
    department: '',
    title: '', // 시술명(드롭다운)
    memo: '',
    phone: '',
    gender: '',
    status: '대기'
  });

  // 생년월일 드롭다운 상태
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');

  // ✅ 시간 복수 선택
  const [selectedTimes, setSelectedTimes] = useState([]);

  // 예약 중복된 시간 목록 구하기 (기존 로직 그대로)
  const reservedTimes = useMemo(() => {
    if (!form.department || !form.reservationDate || !Array.isArray(eventsForDate)) return [];
    return eventsForDate
      .filter(e => e.department === form.department && e.reservationDate === form.reservationDate && (!initialData || initialData.time !== e.time))
      .flatMap(e => {
        if (e.time && e.time.includes('~')) {
          const [start, end] = e.time.split('~');
          const idxStart = HOUR_MAP.indexOf(start);
          const idxEnd = HOUR_MAP.indexOf(end);
          return HOUR_MAP.slice(idxStart, idxEnd + 1);
        }
        return [e.time];
      });
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
        title: initialData.title || '',
        memo: initialData.memo || initialData.notes || '',
        phone: initialData.phone || '',
        gender: initialData.gender || '',
        status: initialData.status || '대기'
      });

      if (initialData.time && initialData.time.includes('~')) {
        const [start, end] = initialData.time.split('~');
        const idxStart = HOUR_MAP.indexOf(start);
        const idxEnd = HOUR_MAP.indexOf(end);
        setSelectedTimes(HOUR_MAP.slice(idxStart, idxEnd + 1));
      } else if (initialData.time) {
        setSelectedTimes([initialData.time]);
      } else {
        setSelectedTimes([]);
      }

      setBirthYear(yy || ''); setBirthMonth(mm || ''); setBirthDay(dd || '');
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setForm(prev => ({
        ...prev,
        reservationDate: selectedDate || today,
        time: '',
        department: '',
        title: '',
      }));
      setSelectedTimes([]);
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
    setForm(prev => ({ ...prev, [name]: value, ...(name === 'department' ? { title: '' } : {}) }));
    if (name === 'department') setSelectedTimes([]);
  };

  // 시간 버튼 클릭
  const handleTimeClick = (t) => {
    if (reservedTimes.includes(t)) return;
    if (selectedTimes.includes(t)) {
      setSelectedTimes(selectedTimes.filter(x => x !== t));
    } else {
      setSelectedTimes([...selectedTimes, t].sort());
    }
  };

  const isContinuous = (arr) => {
    const idx = arr.map(t => HOUR_MAP.indexOf(t)).sort((a,b) => a-b);
    for (let i=1; i<idx.length; ++i) if (idx[i] !== idx[i-1]+1) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!form.name || !form.birth || !form.reservationDate || selectedTimes.length === 0 || !form.department || !form.title) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }
    // 연속 구간이면 10:00~11:00 식으로, 비연속은 콤마로
    const sorted = [...selectedTimes].sort((a,b)=>HOUR_MAP.indexOf(a)-HOUR_MAP.indexOf(b));
    let timeLabel;
    if (sorted.length === 1) timeLabel = sorted[0];
    else if (isContinuous(sorted)) timeLabel = `${sorted[0]}~${sorted[sorted.length-1]}`;
    else timeLabel = sorted.join(',');
    onSave({ ...form, time: timeLabel });
  };

  const departmentHours = HOUR_MAP;
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
          <select name="department" value={form.department} onChange={handleChange} required>
            <option value="">선택</option>
            <option value="보철과">보철과</option>
            <option value="교정과">교정과</option>
            <option value="치주과">치주과</option>
          </select>
        </Field>
        {form.department && (
          <Field>
            <label>시술명</label>
            <select
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            >
              <option value="">선택</option>
              {PROCEDURE_MAP[form.department].map(title => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
          </Field>
        )}
        {form.department && form.reservationDate && (
          <>
            {am.length > 0 && <AmPmLabel>오전</AmPmLabel>}
            <TimeGrid>
              {am.map(t => (
                <TimeButton
                  key={t}
                  type="button"
                  selected={selectedTimes.includes(t)}
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
                  selected={selectedTimes.includes(t)}
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
