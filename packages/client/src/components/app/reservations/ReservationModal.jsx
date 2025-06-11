import React, { useState, useEffect, useMemo, useRef } from 'react';

const HOUR_MAP = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const splitAmPm = (list) => ({
  am: list.filter(h => +h.split(':')[0] < 12),
  pm: list.filter(h => +h.split(':')[0] >= 12)
});
const getYearList = (start = 1920) => Array.from({ length: new Date().getFullYear() - start + 1 }, (_, i) => String(new Date().getFullYear() - i));
const getMonthList = () => Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const getDayList = (year, month) => {
  const last = new Date(Number(year), Number(month), 0).getDate();
  return Array.from({ length: last }, (_, i) => String(i + 1).padStart(2, '0'));
};

const PROCEDURE_MAP = {
  '보철과': ['라미네이트', '임플란트', '올세라믹 크라운'],
  '교정과': ['클리피씨 교정', '투명교정', '설측교정'],
  '치주과': ['치석제거', '치근활택술', '치은성형술'],
};
const DEPARTMENT_TO_CHAIR = { '보철과': '1', '교정과': '2', '치주과': '3' };
const DOCTOR_MAP = {
  '보철과': [{ name: '김치과 원장', id: 'doctor1' }, { name: '이보철 선생', id: 'doctor2' }],
  '교정과': [{ name: '박교정 원장', id: 'doctor3' }, { name: '정교정 선생', id: 'doctor4' }],
  '치주과': [{ name: '최치주 원장', id: 'doctor5' }, { name: '한치주 선생', id: 'doctor6' }]
};

const ReservationModal = ({ open, onClose, onSave, initialData, selectedDate, eventsForDate = [] }) => {
  const [form, setForm] = useState({ name: '', birth: '', userId: '', date: '', department: '', title: '', doctor: '', doctorId: '', chairNumber: '', memo: '', phone: '', gender: '', status: '대기' });
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const latestFetch = useRef(0);

  const reservedTimes = useMemo(() => {
    if (!form.department || !form.date || !Array.isArray(eventsForDate)) return [];
    return eventsForDate.filter(e => e.department === form.department && e.date === form.date)
      .flatMap(e => {
        const idxStart = HOUR_MAP.indexOf(e.startTime);
        const idxEnd = HOUR_MAP.indexOf(e.endTime);
        return HOUR_MAP.slice(idxStart, idxEnd + 1);
      });
  }, [form.department, form.date, eventsForDate]);

  useEffect(() => {
    if (form.name && form.birth) {
      const currentFetch = Date.now();
      latestFetch.current = currentFetch;
      fetch(`/users/userId?name=${encodeURIComponent(form.name)}&birth=${encodeURIComponent(form.birth)}`)
        .then(res => res.json())
        .then(data => { if (latestFetch.current === currentFetch) setForm(prev => ({ ...prev, userId: data.userId || '' })); })
        .catch(() => { if (latestFetch.current === currentFetch) setForm(prev => ({ ...prev, userId: '' })); });
    } else {
      setForm(prev => ({ ...prev, userId: '' }));
    }
  }, [form.name, form.birth]);

  useEffect(() => {
    if (initialData) {
      const [yy, mm, dd] = (initialData.birth || '').split('-');
      setForm({ ...initialData, chairNumber: initialData.chairNumber || DEPARTMENT_TO_CHAIR[initialData.department] || '', memo: initialData.memo || initialData.notes || '' });
      setBirthYear(yy || ''); setBirthMonth(mm || ''); setBirthDay(dd || '');
      if (initialData.startTime && initialData.endTime) {
        const idxStart = HOUR_MAP.indexOf(initialData.startTime);
        const idxEnd = HOUR_MAP.indexOf(initialData.endTime);
        setSelectedTimes(HOUR_MAP.slice(idxStart, idxEnd + 1));
      }
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setForm(prev => ({ ...prev, date: selectedDate || today }));
      setSelectedTimes([]); setBirthYear(''); setBirthMonth(''); setBirthDay('');
    }
  }, [initialData, selectedDate]);

  useEffect(() => {
    if (birthYear && birthMonth && birthDay) setForm(prev => ({ ...prev, birth: `${birthYear}-${birthMonth}-${birthDay}` }));
  }, [birthYear, birthMonth, birthDay]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'doctor') {
      const found = DOCTOR_MAP[form.department]?.find(d => d.name === value);
      setForm(prev => ({ ...prev, doctor: value, doctorId: found?.id || '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value, ...(name === 'department' ? { title: '', doctor: '', doctorId: '', chairNumber: DEPARTMENT_TO_CHAIR[value] || '' } : {}) }));
      if (name === 'department') setSelectedTimes([]);
    }
  };

  const handleTimeClick = (t) => {
    if (reservedTimes.includes(t)) return;
    setSelectedTimes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t].sort());
  };

  const isContinuous = (arr) => {
    const idx = arr.map(t => HOUR_MAP.indexOf(t)).sort((a, b) => a - b);
    return idx.every((v, i, a) => i === 0 || v === a[i - 1] + 1);
  };

  const handleSubmit = () => {
    if (!form.userId || !form.doctorId || !form.date || !selectedTimes.length || !form.department || !form.title || !form.chairNumber) {
      alert('필수 항목 누락'); return;
    }
    if (!isContinuous(selectedTimes)) {
      alert('시간은 연속으로 선택되어야 합니다.'); return;
    }
    const [startTime, endTime] = [selectedTimes[0], selectedTimes[selectedTimes.length - 1]];
    onSave({ ...form, startTime, endTime, chairNumber: parseInt(form.chairNumber, 10) });
  };

  const { am, pm } = splitAmPm(HOUR_MAP);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[400px] max-h-[85vh] overflow-y-auto shadow-lg">
        <h3 className="text-lg font-semibold mb-4">예약 {initialData ? '수정' : '등록'}</h3>

        {[['이름', 'name'], ['연락처', 'phone'], ['예약일', 'date']].map(([label, name]) => (
          <div className="mb-4" key={name}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input name={name} type={name === 'date' ? 'date' : 'text'} value={form[name]} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">생년월일</label>
          <div className="flex gap-2">
            {[birthYear, birthMonth, birthDay].map((val, i) => (
              <select key={i} value={val} onChange={e => [setBirthYear, setBirthMonth, setBirthDay][i](e.target.value)} className="flex-1 border rounded px-2 py-1 text-sm">
                <option value="">{['년', '월', '일'][i]}</option>
                {(i === 0 ? getYearList() : i === 1 ? getMonthList() : getDayList(birthYear, birthMonth)).map(opt => (
                  <option key={opt} value={opt}>{opt}{['년', '월', '일'][i]}</option>
                ))}
              </select>
            ))}
          </div>
        </div>

        {['성별', '진료과', '담당의', '시술명'].map(label => (
          label === '담당의' && !form.department ? null : label === '시술명' && !form.department ? null : (
            <div className="mb-4" key={label}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <select name={{'성별':'gender','진료과':'department','담당의':'doctor','시술명':'title'}[label]} value={form[{'성별':'gender','진료과':'department','담당의':'doctor','시술명':'title'}[label]]} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm">
                <option value="">선택</option>
                {(label === '성별' ? ['남', '여'] : label === '진료과' ? Object.keys(DOCTOR_MAP) : label === '담당의' ? DOCTOR_MAP[form.department]?.map(d => d.name) : PROCEDURE_MAP[form.department])?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )
        ))}

        {(am.length || pm.length) && <div className="text-blue-600 font-semibold mt-2 mb-1">오전</div>}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {am.map(t => (
            <button key={t} type="button" className={`rounded py-2 border text-sm font-medium ${selectedTimes.includes(t) ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-100 text-gray-700'} ${reservedTimes.includes(t) ? 'opacity-40 cursor-not-allowed' : ''}`} onClick={() => handleTimeClick(t)} disabled={reservedTimes.includes(t)}>{t}</button>
          ))}
        </div>
        {(pm.length) && <div className="text-blue-600 font-semibold mt-2 mb-1">오후</div>}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {pm.map(t => (
            <button key={t} type="button" className={`rounded py-2 border text-sm font-medium ${selectedTimes.includes(t) ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-100 text-gray-700'} ${reservedTimes.includes(t) ? 'opacity-40 cursor-not-allowed' : ''}`} onClick={() => handleTimeClick(t)} disabled={reservedTimes.includes(t)}>{t}</button>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">메모</label>
          <textarea name="memo" value={form.memo} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm h-24 resize-y" />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm">취소</button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded text-sm" disabled={!form.userId}>저장</button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
