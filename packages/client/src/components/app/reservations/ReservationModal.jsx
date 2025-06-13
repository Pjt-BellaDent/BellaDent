import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from '../../../libs/axiosIntance';

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

const INITIAL_FORM = {
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
  status: '대기'
};

const ReservationModal = ({ open, onClose, onSave, initialData, selectedDate, eventsForDate = [] }) => {
  const [form, setForm] = useState(INITIAL_FORM);
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
      axios.get('/users/patients/find', {
        params: { name: form.name, birth: form.birth }
      })
      .then(res => {
        if (latestFetch.current === currentFetch) setForm(prev => ({ ...prev, userId: res.data.userId || '' }));
      })
      .catch(() => {
        if (latestFetch.current === currentFetch) setForm(prev => ({ ...prev, userId: '' }));
      });
    } else {
      setForm(prev => ({ ...prev, userId: '' }));
    }
  }, [form.name, form.birth]);

  useEffect(() => {
    if (initialData) {
      const [yy, mm, dd] = (initialData.birth || '').split('-');
      setForm({
        ...INITIAL_FORM,
        ...initialData,
        chairNumber: initialData.chairNumber || DEPARTMENT_TO_CHAIR[initialData.department] || '',
        memo: initialData.memo || initialData.notes || ''
      });
      setBirthYear(yy || '');
      setBirthMonth(mm || '');
      setBirthDay(dd || '');
      if (initialData.startTime && initialData.endTime) {
        const idxStart = HOUR_MAP.indexOf(initialData.startTime);
        const idxEnd = HOUR_MAP.indexOf(initialData.endTime);
        setSelectedTimes(HOUR_MAP.slice(idxStart, idxEnd + 1));
      }
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setForm({ ...INITIAL_FORM, date: selectedDate || today });
      setSelectedTimes([]);
      setBirthYear('');
      setBirthMonth('');
      setBirthDay('');
    }
  }, [initialData, selectedDate]);

  useEffect(() => {
    if (birthYear && birthMonth && birthDay) {
      setForm(prev => ({ ...prev, birth: `${birthYear}-${birthMonth}-${birthDay}` }));
    } else {
      setForm(prev => ({ ...prev, birth: '' }));
    }
  }, [birthYear, birthMonth, birthDay]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'doctor') {
      const found = DOCTOR_MAP[form.department]?.find(d => d.name === value);
      setForm(prev => ({ ...prev, doctor: value, doctorId: found?.id || '' }));
    } else if (name === 'department') {
      setForm(prev => ({
        ...prev,
        department: value,
        title: '',
        doctor: '',
        doctorId: '',
        chairNumber: DEPARTMENT_TO_CHAIR[value] || ''
      }));
      setSelectedTimes([]);
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
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
    if (!form.name || !form.date || !selectedTimes.length || !form.department || !form.title) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    if (!isContinuous(selectedTimes)) {
      alert('시간은 연속으로 선택되어야 합니다.');
      return;
    }
    const [startTime, endTime] = [selectedTimes[0], selectedTimes[selectedTimes.length - 1]];
    onSave({ ...form, startTime, endTime });
  };

  const { am, pm } = splitAmPm(HOUR_MAP);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg w-[400px] shadow-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-4 py-3">
          <h3 className="text-lg font-medium">{initialData?.id ? '예약 수정' : '예약 등록'}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>
            {`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>

          {[['이름', 'name'], ['연락처', 'phone'], ['예약일', 'date']].map(([label, name]) => (
            <div className="mb-4" key={name}>
              <label className="block text-sm text-gray-700 mb-1">{label}</label>
              <input
                name={name}
                type={name === 'date' ? 'date' : 'text'}
                value={form[name] || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                placeholder={`${label}을(를) 입력하세요`}
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">생년월일</label>
            <div className="flex gap-2">
              {[
                [birthYear, setBirthYear, getYearList(), '년'],
                [birthMonth, setBirthMonth, getMonthList(), '월'],
                [birthDay, setBirthDay, getDayList(birthYear, birthMonth), '일']
              ].map(([value, setter, options, unit], i) => (
                <select
                  key={i}
                  value={value || ''}
                  onChange={e => setter(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">{unit}</option>
                  {options.map(opt => (
                    <option key={opt} value={opt}>{opt}{unit}</option>
                  ))}
                </select>
              ))}
            </div>
          </div>

          {[
            ['성별', 'gender', ['남', '여']],
            ['진료과', 'department', Object.keys(DOCTOR_MAP)],
            ['담당의', 'doctor', DOCTOR_MAP[form.department]?.map(d => d.name) || []],
            ['시술명', 'title', PROCEDURE_MAP[form.department] || []]
          ].map(([label, name, options]) => (
            (!['담당의', '시술명'].includes(label) || form.department) && (
              <div className="mb-4" key={label}>
                <label className="block text-sm text-gray-700 mb-1">{label}</label>
                <select
                  name={name}
                  value={form[name] || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">선택</option>
                  {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            )
          ))}

          <div className="mb-4">
            {(am.length || pm.length) && <div className="text-sm text-gray-700 font-medium mb-2">오전</div>}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {am.map(t => (
                <button
                  key={t}
                  type="button"
                  className={`py-2 text-sm font-medium rounded transition-colors
                    ${selectedTimes.includes(t)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${reservedTimes.includes(t) ? 'opacity-40 cursor-not-allowed' : ''}`}
                  onClick={() => handleTimeClick(t)}
                  disabled={reservedTimes.includes(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {pm.length > 0 && <div className="text-sm text-gray-700 font-medium mb-2">오후</div>}
            <div className="grid grid-cols-4 gap-2">
              {pm.map(t => (
                <button
                  key={t}
                  type="button"
                  className={`py-2 text-sm font-medium rounded transition-colors
                    ${selectedTimes.includes(t)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${reservedTimes.includes(t) ? 'opacity-40 cursor-not-allowed' : ''}`}
                  onClick={() => handleTimeClick(t)}
                  disabled={reservedTimes.includes(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">메모</label>
            <textarea
              name="memo"
              value={form.memo || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-24 resize-y focus:outline-none focus:border-blue-500"
              placeholder="메모를 입력하세요"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
