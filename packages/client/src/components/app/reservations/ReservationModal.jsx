// src/components/app/reservations/ReservationModal.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from '../../../libs/axiosInstance.js';

const HOUR_MAP = [
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];
const splitAmPm = (list) => ({
  am: list.filter((h) => +h.split(':')[0] < 12),
  pm: list.filter((h) => +h.split(':')[0] >= 12),
});
const getYearList = (start = 1920) =>
  Array.from({ length: new Date().getFullYear() - start + 1 }, (_, i) =>
    String(new Date().getFullYear() - i)
  );
const getMonthList = () =>
  Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const getDayList = (year, month) => {
  const last = new Date(Number(year), Number(month), 0).getDate();
  return Array.from({ length: last }, (_, i) => String(i + 1).padStart(2, '0'));
};

const PROCEDURE_MAP = {
  보철과: ['라미네이트', '임플란트', '올세라믹 크라운'],
  교정과: ['클리피씨 교정', '투명교정', '설측교정'],
  치주과: ['치석제거', '치근활택술', '치은성형술'],
  심미치료: ['라미네이트', '잇몸성형', '전문가 미백'],
  '교정/미백': ['클리피씨 교정', '투명교정', '전문가 미백'],
  '일반 진료/보철': ['스케일링', '충치치료', '임플란트'],
};
const DEPARTMENT_TO_CHAIR = { 보철과: '1', 교정과: '2', 치주과: '3' };
const DOCTOR_MAP = {
  보철과: ['김치과 원장', '이보철 선생'],
  교정과: ['박교정 원장', '정교정 선생'],
  치주과: ['최치주 원장', '한치주 선생'],
};
const times = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const INITIAL_FORM = {
  name: '',
  birth: '',
  date: '',
  department: '',
  title: '',
  doctor: '',
  doctorUid: '',
  chairNumber: '',
  memo: '',
  phone: '',
  gender: '',
  patientUid: '',
  status: '대기',
};

const ReservationModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  date,
  staffList = [],
}) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [patients, setPatients] = useState([]);
  const [nameMatches, setNameMatches] = useState([]);
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const latestFetch = useRef(0);

  const availableDoctors = useMemo(() => {
    if (!form.department) return [];
    return staffList.filter((staff) => staff.department === form.department);
  }, [form.department, staffList]);

  const reservedTimes = useMemo(() => {
    if (!form.department || !form.date) return [];
    return [];
  }, [form.department, form.date]);

  useEffect(() => {
    axios.get('/users/patients/all').then((res) => {
      setPatients(res.data.patientsInfo || []);
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const newFormState = {
          ...INITIAL_FORM,
          ...initialData,
          date: initialData.date || date,
          doctorUid: initialData.doctorUid || initialData.doctorId || '',
          patientUid: initialData.patientUid || initialData.userId || '',
        };
        setForm(newFormState);

        setSelectedTimes(initialData.startTime ? [initialData.startTime] : []);
        const [yy, mm, dd] = (initialData.birth || '').split('-');
        setBirthYear(yy || '');
        setBirthMonth(mm || '');
        setBirthDay(dd || '');
      } else {
        setForm({ ...INITIAL_FORM, date });
        setSelectedTimes([]);
        setBirthYear('');
        setBirthMonth('');
        setBirthDay('');
      }
    }
  }, [isOpen, initialData, date]);

  useEffect(() => {
    if (form.name && form.birth) {
      const currentFetch = Date.now();
      latestFetch.current = currentFetch;
    } else {
      setForm((prev) => ({ ...prev, patientUid: '' }));
    }
  }, [form.name, form.birth]);

  useEffect(() => {
    if (birthYear && birthMonth && birthDay) {
      const newBirth = `${birthYear}-${birthMonth}-${birthDay}`;
      if (form.birth !== newBirth) {
        setForm((prev) => ({ ...prev, birth: newBirth }));
      }
    }
  }, [birthYear, birthMonth, birthDay]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, name: value }));
    if (!value) {
      setNameMatches([]);
      setShowPhoneDropdown(false);
      setForm((prev) => ({
        ...prev,
        phone: '',
        gender: '',
        birth: '',
        patientUid: '',
      }));
      setBirthYear('');
      setBirthMonth('');
      setBirthDay('');
      return;
    }
    const matches = patients.filter((p) => p.name === value);
    setNameMatches(matches);
    if (matches.length === 1) {
      const found = matches[0];
      let y = '',
        m = '',
        d = '';
      if (found.birth && found.birth.includes('-')) {
        [y, m, d] = found.birth.split('-');
      } else if (found.birth && found.birth.length === 8) {
        y = found.birth.slice(0, 4);
        m = found.birth.slice(4, 6);
        d = found.birth.slice(6, 8);
      }
      setBirthYear(y);
      setBirthMonth(m);
      setBirthDay(d);
      setForm((prev) => ({
        ...prev,
        patientUid: found.id || found.patientUid || found.userId || '',
        phone: found.phone || '',
        gender: found.gender || '',
        birth: found.birth || '',
      }));
      setShowPhoneDropdown(false);
    } else if (matches.length > 1) {
      setShowPhoneDropdown(true);
    } else {
      setShowPhoneDropdown(false);
      setForm((prev) => ({
        ...prev,
        phone: '',
        gender: '',
        birth: '',
        patientUid: '',
      }));
      setBirthYear('');
      setBirthMonth('');
      setBirthDay('');
    }
  };

  const handlePhoneSelect = (phone) => {
    setForm((prev) => ({ ...prev, phone }));
    const found = nameMatches.find((p) => p.phone === phone);
    if (found) {
      setForm((prev) => ({
        ...prev,
        patientUid: found.id || found.patientUid || found.userId || '',
        phone: found.phone || '',
        gender: found.gender || '',
        ...(found.birth
          ? (() => {
              let y = '',
                m = '',
                d = '';
              if (found.birth.includes('-')) {
                [y, m, d] = found.birth.split('-');
              } else if (found.birth.length === 8) {
                y = found.birth.slice(0, 4);
                m = found.birth.slice(4, 6);
                d = found.birth.slice(6, 8);
              }
              setBirthYear(y);
              setBirthMonth(m);
              setBirthDay(d);
              return { birth: `${y}-${m}-${d}` };
            })()
          : {}),
      }));
      setShowPhoneDropdown(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'doctor') {
      const selectedDoctor = availableDoctors.find((doc) => doc.name === value);
      setForm((prev) => ({
        ...prev,
        doctor: value,
        doctorUid: selectedDoctor ? selectedDoctor.uid : '',
        chairNumber: selectedDoctor
          ? selectedDoctor.chairNumber ||
            DEPARTMENT_TO_CHAIR[prev.department] ||
            ''
          : '',
      }));
    } else if (name === 'department') {
      setForm((prev) => ({
        ...prev,
        department: value,
        title: '',
        doctor: '',
        doctorUid: '',
        chairNumber: '',
      }));
      setSelectedTimes([]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTimeClick = (t) => {
    if (reservedTimes.includes(t)) return;
    setSelectedTimes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t].sort()
    );
  };

  const isContinuous = (arr) => {
    const idx = arr.map((t) => HOUR_MAP.indexOf(t)).sort((a, b) => a - b);
    return idx.every((v, i, a) => i === 0 || v === a[i - 1] + 1);
  };

  const handleNameBlur = (e) => {
    const value = e.target.value;
    const found = patients.find((p) => p.name === value);
    if (
      found &&
      (!form.patientUid ||
        form.patientUid !== (found.id || found.patientUid || found.userId))
    ) {
      setForm((prev) => ({
        ...prev,
        patientUid: found.id || found.patientUid || found.userId || '',
      }));
    }
  };

  const handleSubmit = () => {
    let finalPatientUid = form.patientUid;
    if (!finalPatientUid) {
      const found = patients.find(
        (p) =>
          p.name === form.name && (!showPhoneDropdown || p.phone === form.phone)
      );
      if (found)
        finalPatientUid = found.id || found.patientUid || found.userId || '';
    }
    const missing = [];
    if (!form.title) missing.push('시술명');
    if (!form.date) missing.push('예약일');
    if (!form.name) missing.push('이름');
    if (!form.department) missing.push('진료과');
    if (!form.doctor) missing.push('담당의');
    if (!finalPatientUid) missing.push('환자');
    if (selectedTimes.length === 0) missing.push('예약 시간');

    if (missing.length > 0) {
      alert(`${missing.join(', ')} 정보를 모두 선택해 주세요.`);
      return;
    }

    const payload = {
      ...form,
      startTime: selectedTimes[0] || '',
      endTime: selectedTimes[selectedTimes.length - 1] || '',
      patientUid: finalPatientUid,
    };

    if (!payload.chairNumber) {
      payload.chairNumber = '1';
    }

    onSave(payload);
    onClose();
  };

  const { am, pm } = splitAmPm(HOUR_MAP);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl flex flex-col w-full max-w-md max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-2">
          <h2 className="text-xl font-bold">
            {form.id ? '예약 수정' : '예약 등록'}
          </h2>
        </div>

        <div className="p-6 pt-0 space-y-4 overflow-y-auto scrollbar-hide">
          <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

          <div className="mb-4 relative">
            <label className="block text-sm text-gray-700 mb-1">이름</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5"
              placeholder="이름(을) 입력하세요"
            />
            {showPhoneDropdown && nameMatches.length > 1 && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                <ul className="max-h-60 overflow-auto">
                  {nameMatches.map((p) => (
                    <li
                      key={p.phone}
                      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => handlePhoneSelect(p.phone)}
                    >
                      {p.name} - {p.phone}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

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
                [
                  birthDay,
                  setBirthDay,
                  getDayList(birthYear, birthMonth),
                  '일',
                ],
              ].map(([value, setter, options, unit], i) => (
                <select
                  key={i}
                  value={value || ''}
                  onChange={(e) => setter(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">{unit}</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                      {unit}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                진료과
              </label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">진료과 선택</option>
                {[...new Set(staffList.map((s) => s.department))].map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                담당의
              </label>
              <select
                name="doctor"
                value={form.doctor}
                onChange={handleChange}
                disabled={!form.department}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">담당의 선택</option>
                {availableDoctors.map((doc) => (
                  <option key={doc.uid} value={doc.name}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                성별
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">선택</option>
                <option value="M">남</option>
                <option value="F">여</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                시술명
              </label>
              <select
                name="title"
                value={form.title}
                onChange={handleChange}
                disabled={!form.department}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">선택</option>
                {(PROCEDURE_MAP[form.department] || []).map((proc) => (
                  <option key={proc} value={proc}>
                    {proc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            {(am.length || pm.length) && (
              <div className="text-sm text-gray-700 font-medium mb-2">오전</div>
            )}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {am.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`py-2 text-sm font-medium rounded transition-colors
                    ${
                      selectedTimes.includes(t)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${
                    reservedTimes.includes(t)
                      ? 'opacity-40 cursor-not-allowed'
                      : ''
                  }`}
                  onClick={() => handleTimeClick(t)}
                  disabled={reservedTimes.includes(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {pm.length > 0 && (
              <div className="text-sm text-gray-700 font-medium mb-2">오후</div>
            )}
            <div className="grid grid-cols-4 gap-2">
              {pm.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`py-2 text-sm font-medium rounded transition-colors
                    ${
                      selectedTimes.includes(t)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${
                    reservedTimes.includes(t)
                      ? 'opacity-40 cursor-not-allowed'
                      : ''
                  }`}
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
        </div>

        <div className="p-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
