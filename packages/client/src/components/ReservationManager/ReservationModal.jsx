import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
`;
const Field = styled.div`
  margin-bottom: 16px;
  label { display: block; font-size: 14px; margin-bottom: 6px; }
  input, select, textarea {
    width: 100%;
    padding: 8px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  textarea { resize: vertical; height: 60px; }
`;
const BirthRow = styled.div`
  display: flex; gap: 6px;
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
  .save { background: #007bff; color: white; }
  .cancel { background: #ccc; }
`;

const HOUR_MAP = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const splitAmPm = (list) => ({
  am: list.filter(h => +h.split(':')[0] < 12),
  pm: list.filter(h => +h.split(':')[0] >= 12)
});

const getYearList = (start = 1920) => {
  const now = new Date().getFullYear();
  return Array.from({ length: now - start + 1 }, (_, i) => String(now - i));
};
const getMonthList = () => Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const getDayList = (year, month) => {
  if (!year || !month) return Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const last = new Date(Number(year), Number(month), 0).getDate();
  return Array.from({ length: last }, (_, i) => String(i + 1).padStart(2, '0'));
};

const PROCEDURE_MAP = {
  '보철과': ['라미네이트', '임플란트', '올세라믹 크라운'],
  '교정과': ['클리피씨 교정', '투명교정', '설측교정'],
  '치주과': ['치석제거', '치근활택술', '치은성형술'],
};
const DEPARTMENT_TO_CHAIR = {
  '보철과': '1',
  '교정과': '2',
  '치주과': '3',
};
const DOCTOR_MAP = {
  '보철과': [
    { name: '김치과 원장', id: 'doctor1' },
    { name: '이보철 선생', id: 'doctor2' },
  ],
  '교정과': [
    { name: '박교정 원장', id: 'doctor3' },
    { name: '정교정 선생', id: 'doctor4' },
  ],
  '치주과': [
    { name: '최치주 원장', id: 'doctor5' },
    { name: '한치주 선생', id: 'doctor6' },
  ],
};

const ReservationModal = ({ open, onClose, onSave, initialData, selectedDate, eventsForDate = [] }) => {
  const [form, setForm] = useState({
    name: '',
    birth: '',
    userId: '',
    date: '',
    department: '',
    title: '',
    doctor: '',
    doctorId: '',
    chairNumber: '',
    memo: '',
    phone: '',
    gender: '',
    status: '대기',
  });
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);

  // userId fetch race condition 방지
  const latestFetch = useRef(0);

  // 예약 시간 차단(해당 날짜, 해당 진료과, 이미 예약된 구간)
  const reservedTimes = useMemo(() => {
    if (!form.department || !form.date || !Array.isArray(eventsForDate)) return [];
    return eventsForDate
      .filter(e => e.department === form.department && e.date === form.date)
      .flatMap(e => {
        if (e.startTime && e.endTime) {
          const idxStart = HOUR_MAP.indexOf(e.startTime);
          const idxEnd = HOUR_MAP.indexOf(e.endTime);
          return HOUR_MAP.slice(idxStart, idxEnd + 1);
        }
        return [];
      });
  }, [form.department, form.date, eventsForDate]);

  // userId 자동 조회
  useEffect(() => {
    if (form.name && form.birth) {
      const currentFetch = Date.now();
      latestFetch.current = currentFetch;
      fetch(`http://localhost:3000/users/userId?name=${encodeURIComponent(form.name)}&birth=${encodeURIComponent(form.birth)}`)
        .then(res => res.json())
        .then(data => {
          if (latestFetch.current === currentFetch) {
            setForm(prev => ({ ...prev, userId: data.userId || "" }));
          }
        })
        .catch(() => {
          if (latestFetch.current === currentFetch) {
            setForm(prev => ({ ...prev, userId: "" }));
          }
        });
    } else {
      setForm(prev => ({ ...prev, userId: "" }));
    }
  }, [form.name, form.birth]);

  useEffect(() => {
    if (initialData) {
      const [yy, mm, dd] = (initialData.birth || '').split('-');
      setForm({
        name: initialData.name || '',
        birth: initialData.birth || '',
        userId: initialData.userId || '',
        date: initialData.date || selectedDate || '',
        department: initialData.department || '',
        title: initialData.title || '',
        doctor: initialData.doctor || '',
        doctorId: initialData.doctorId || '',
        chairNumber: initialData.chairNumber || DEPARTMENT_TO_CHAIR[initialData.department] || '',
        memo: initialData.memo || initialData.notes || '',
        phone: initialData.phone || '',
        gender: initialData.gender || '',
        status: initialData.status || '대기',
      });
      if (initialData.startTime && initialData.endTime) {
        const idxStart = HOUR_MAP.indexOf(initialData.startTime);
        const idxEnd = HOUR_MAP.indexOf(initialData.endTime);
        setSelectedTimes(HOUR_MAP.slice(idxStart, idxEnd + 1));
      } else {
        setSelectedTimes([]);
      }
      setBirthYear(yy || ''); setBirthMonth(mm || ''); setBirthDay(dd || '');
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setForm(prev => ({
        ...prev,
        userId: '',
        date: selectedDate || today,
        department: '',
        title: '',
        doctor: '',
        doctorId: '',
        chairNumber: '',
      }));
      setSelectedTimes([]);
      setBirthYear(''); setBirthMonth(''); setBirthDay('');
    }
  }, [initialData, selectedDate]);

  useEffect(() => {
    if (birthYear && birthMonth && birthDay) {
      setForm(prev => ({ ...prev, birth: `${birthYear}-${birthMonth}-${birthDay}` }));
    } else {
      setForm(prev => ({ ...prev, birth: '' }));
    }
  }, [birthYear, birthMonth, birthDay]);

  // 담당의(doctorId) 선택시 id도 같이 세팅
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'doctor') {
      const found = DOCTOR_MAP[form.department]?.find(d => d.name === value);
      setForm(prev => ({ ...prev, doctor: value, doctorId: found?.id || '' }));
      return;
    }
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'department' ? { title: '', doctor: '', doctorId: '', chairNumber: DEPARTMENT_TO_CHAIR[value] || '' } : {})
    }));
    if (name === 'department') setSelectedTimes([]);
  };

  // 예약 시간 버튼 클릭
  const handleTimeClick = (t) => {
    if (reservedTimes.includes(t)) return;
    if (selectedTimes.includes(t)) {
      setSelectedTimes(selectedTimes.filter(x => x !== t));
    } else {
      setSelectedTimes([...selectedTimes, t].sort());
    }
  };

  // 연속된 시간 구간만 허용
  const isContinuous = (arr) => {
    const idx = arr.map(t => HOUR_MAP.indexOf(t)).sort((a, b) => a - b);
    for (let i = 1; i < idx.length; ++i) if (idx[i] !== idx[i - 1] + 1) return false;
    return true;
  };

  // 실제 appointments 저장 규격에 맞게 변환해서 onSave 호출
  const handleSubmit = () => {
    if (!form.userId || !form.doctorId || !form.date || selectedTimes.length === 0 || !form.department || !form.title || !form.chairNumber) {
      alert('필수 항목 누락. 담당의/환자 선택, 날짜, 시간, 진료과, 시술, 체어를 모두 선택해주세요.');
      return;
    }
    const sorted = [...selectedTimes].sort((a, b) => HOUR_MAP.indexOf(a) - HOUR_MAP.indexOf(b));
    let startTime = sorted[0];
    let endTime = sorted[sorted.length - 1];
    if (!isContinuous(sorted)) {
      alert('시작/종료 시간이 연속적으로 선택되어야 합니다.');
      return;
    }
    const chairNumber = parseInt(form.chairNumber, 10);
    onSave({
      userId: form.userId,
      doctorId: form.doctorId,
      department: form.department, // ★ 반드시 포함!
      date: form.date,
      startTime,
      endTime,
      chairNumber,
      status: form.status || 'reserved',
      title: form.title,
      memo: form.memo,
      name: form.name,     // ← 추가!!
      birth: form.birth,   // ← 추가!!
      // 추가 필드 필요시 여기에
    });
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
              {getYearList().map(y => (<option key={y} value={y}>{y}년</option>))}
            </select>
            <select value={birthMonth} onChange={e => setBirthMonth(e.target.value)}>
              <option value="">월</option>
              {getMonthList().map(m => (<option key={m} value={m}>{m}월</option>))}
            </select>
            <select value={birthDay} onChange={e => setBirthDay(e.target.value)}>
              <option value="">일</option>
              {getDayList(birthYear, birthMonth).map(d => (<option key={d} value={d}>{d}일</option>))}
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
          <input type="date" name="date" value={form.date} onChange={handleChange} />
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
            <label>담당의</label>
            <select
              name="doctor"
              value={form.doctor}
              onChange={handleChange}
              required
            >
              <option value="">선택</option>
              {DOCTOR_MAP[form.department].map(doctor => (
                <option key={doctor.id} value={doctor.name}>{doctor.name}</option>
              ))}
            </select>
          </Field>
        )}
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
        {form.department && form.date && (
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
          <button
            className="save"
            onClick={handleSubmit}
            disabled={!form.userId}
            title={!form.userId ? "등록된 환자만 예약 가능" : ""}
          >
            저장
          </button>
        </ButtonRow>
      </ModalBox>
    </ModalBackground>
  );
};

export default ReservationModal;
