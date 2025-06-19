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
  '보철과': ['김치과 원장', '이보철 선생'],
  '교정과': ['박교정 원장', '정교정 선생'],
  '치주과': ['최치주 원장', '한치주 선생'],
};
const times = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

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
  const [patients, setPatients] = useState([]);
  const [nameMatches, setNameMatches] = useState([]);
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
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
    axios.get('/patients').then(res => setPatients(res.data));
  }, []);

  useEffect(() => {
    if (form.name && form.birth) {
      const currentFetch = Date.now();
      latestFetch.current = currentFetch;
      // axios.get('/users/patients/find', { params: { name: form.name, birth: form.birth } })
      // ... existing code ...
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
        doctorId: initialData.doctor
          ? (DOCTOR_MAP[initialData.department]?.find(d => d.name === initialData.doctor)?.id || '')
          : '',
        chairNumber: initialData.department
          ? (DEPARTMENT_TO_CHAIR[initialData.department] || '')
          : '',
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
      const newBirth = `${birthYear}-${birthMonth}-${birthDay}`;
      if (form.birth !== newBirth) {
        setForm(prev => ({ ...prev, birth: newBirth }));
      }
    }
    // else는 form.birth를 ''로 덮어쓰지 않음
  }, [birthYear, birthMonth, birthDay]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, name: value }));
    if (!value) {
      setNameMatches([]);
      setShowPhoneDropdown(false);
      setForm(prev => ({ ...prev, phone: '', gender: '', birth: '', userId: '' }));
      setBirthYear(''); setBirthMonth(''); setBirthDay('');
      return;
    }
    const matches = patients.filter(p => p.name === value);
    setNameMatches(matches);
    if (matches.length >= 1) {
      const found = matches[0];
      let y = '', m = '', d = '';
      if (found.birth && found.birth.includes('-')) {
        [y, m, d] = found.birth.split('-');
      } else if (found.birth && found.birth.length === 8) {
        y = found.birth.slice(0,4); m = found.birth.slice(4,6); d = found.birth.slice(6,8);
      }
      setBirthYear(y); setBirthMonth(m); setBirthDay(d);
      setForm(prev => ({
        ...prev,
        userId: found.id || found.userId || '',
        phone: found.phone || '',
        gender: found.gender || '',
        birth: found.birth || ''
      }));
      setShowPhoneDropdown(matches.length > 1);
    } else {
      setShowPhoneDropdown(false);
      setForm(prev => ({ ...prev, phone: '', gender: '', birth: '', userId: '' }));
      setBirthYear(''); setBirthMonth(''); setBirthDay('');
    }
  };

  const handlePhoneSelect = (phone) => {
    setForm(prev => ({ ...prev, phone }));
    const found = nameMatches.find(p => p.phone === phone);
    if (found) {
      setForm(prev => ({
        ...prev,
        userId: found.id || found.userId || '',
        phone: found.phone || '',
        gender: found.gender || '',
        ...(found.birth ? (() => {
          let y = '', m = '', d = '';
          if (found.birth.includes('-')) {
            [y, m, d] = found.birth.split('-');
          } else if (found.birth.length === 8) {
            y = found.birth.slice(0,4); m = found.birth.slice(4,6); d = found.birth.slice(6,8);
          }
          setBirthYear(y); setBirthMonth(m); setBirthDay(d);
          return { birth: `${y}-${m}-${d}` };
        })() : {})
      }));
      setShowPhoneDropdown(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'doctor') {
      setForm(prev => ({ ...prev, doctor: value }));
    } else if (name === 'department') {
      setForm(prev => ({
        ...prev,
        department: value,
        title: '',
        doctor: '',
        chairNumber: DEPARTMENT_TO_CHAIR[value] || '',
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

  const handleNameBlur = (e) => {
    const value = e.target.value;
    const found = patients.find(p => p.name === value);
    if (found && (!form.userId || form.userId !== found.id)) {
      setForm(prev => ({
        ...prev,
        userId: found.id || found.userId || ''
      }));
    }
  };

  const handleSubmit = () => {
    let userId = form.userId;
    if (!userId) {
      const found = patients.find(p => p.name === form.name && (!showPhoneDropdown || p.phone === form.phone));
      if (found) userId = found.id || found.userId || '';
    }
    const missing = [];
    if (!form.title) missing.push('시술명');
    if (!form.date) missing.push('예약일');
    if (!form.name) missing.push('이름');
    if (!form.department) missing.push('진료과');
    if (!form.doctor) missing.push('담당의');
    if (!form.chairNumber) missing.push('체어번호');
    if (!userId) missing.push('환자');
    if (!selectedTimes.length) missing.push('시간');
    if (missing.length > 0) {
      alert(`${missing.join(', ')} 정보를 모두 선택해 주세요.`);
      return;
    }
    if (!isContinuous(selectedTimes)) {
      alert('시간은 연속으로 선택되어야 합니다.');
      return;
    }
    let doctor = form.doctor || initialData?.doctor || '';
    let department = form.department || initialData?.department || '';
    let startTime = times.find(t => t === selectedTimes[0]) || selectedTimes[0];
    let endTime = times.find(t => t === selectedTimes[selectedTimes.length - 1]) || selectedTimes[selectedTimes.length - 1];
    if (department && doctor) {
      const validDoctors = DOCTOR_MAP[department];
      if (validDoctors && !validDoctors.includes(doctor)) {
        doctor = validDoctors[0];
      }
    }
    const payload = {
      ...form,
      userId,
      chairNumber: Number(form.chairNumber),
      doctor,
      department,
      startTime,
      endTime,
      doctorId: doctor,
      status: form.status || '대기'
    };
    Object.keys(payload).forEach(key => {
      if (payload[key] === '' || payload[key] === undefined) delete payload[key];
    });
    console.log('예약 등록 payload:', payload);
    onSave(payload);
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

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">이름</label>
            <input
              name="name"
              list="patient-names"
              value={form.name || ''}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="이름(을) 입력하세요"
              autoComplete="off"
            />
            <datalist id="patient-names">
              {patients.map(p => (
                <option key={p.id} value={p.name} />
              ))}
            </datalist>
          </div>

          {showPhoneDropdown && (
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">연락처 선택</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={form.phone}
                onChange={e => handlePhoneSelect(e.target.value)}
              >
                <option value="">연락처를 선택하세요</option>
                {nameMatches.map(p => (
                  <option key={p.phone} value={p.phone}>{p.phone}</option>
                ))}
              </select>
            </div>
          )}

          {!showPhoneDropdown && (
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">연락처</label>
              <input
                name="phone"
                type="text"
                value={form.phone || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                placeholder="연락처(를) 입력하세요"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">예약일</label>
            <input
              name="date"
              type="date"
              value={form.date || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="예약일을 입력하세요"
            />
          </div>

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
            ['담당의', 'doctor', DOCTOR_MAP[form.department] || []],
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
