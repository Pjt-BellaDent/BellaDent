// src/app/patients/components/ProcedureModal.jsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from '../../../libs/axiosIntance';

const PROCEDURE_MAP = {
  '보철과': ['라미네이트', '임플란트', '올세라믹 크라운'],
  '교정과': ['클리피씨 교정', '투명교정', '설측교정'],
  '치주과': ['치석제거', '치근활택술', '치은성형술'],
};
const DOCTOR_MAP = {
  '보철과': ['김치과 원장', '이보철 선생'],
  '교정과': ['박교정 원장', '정교정 선생'],
  '치주과': ['최치주 원장', '한치주 선생'],
};
const departments = Object.keys(PROCEDURE_MAP);
const HOUR_MAP = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const splitAmPm = (list) => ({
  am: list.filter(h => +h.split(':')[0] < 12),
  pm: list.filter(h => +h.split(':')[0] >= 12)
});

const ProcedureModal = ({ open, onClose, patient, events = {}, fetchEvents }) => {
  const [procedures, setProcedures] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', date: '', doctor: '', doctorId: '', memo: '', department: '', time: ''
  });

  const reservedTimes = useMemo(() => {
    if (!formData.department || !formData.date || !Array.isArray(events[formData.date])) return [];
    return events[formData.date].filter(e => e.department === formData.department).flatMap(e => {
      if (!e.time) return [];
      if (e.time.includes('~')) {
        const [start, end] = e.time.split('~');
        return HOUR_MAP.slice(HOUR_MAP.indexOf(start), HOUR_MAP.indexOf(end) + 1);
      }
      return e.time.includes(',') ? e.time.split(',') : [e.time];
    });
  }, [formData.department, formData.date, events]);

  const { am, pm } = splitAmPm(HOUR_MAP);

  useEffect(() => {
    if (!open || !patient?.name || !patient?.birth) return;
    axios.get(`/procedures/name/${patient.name}/${patient.birth}`)
      .then(res => setProcedures(res.data))
      .catch(err => console.error('시술 이력 로딩 실패', err));
  }, [open, patient]);

  const handleAdd = async () => {
    const { title, date, doctor, department, time, memo } = formData;
    if (!title || !date || !doctor || !department || !time) return alert('모든 필수 입력값을 채워주세요!');

    const newEntry = { ...formData, name: patient.name, birth: patient.birth };
    try {
      await axios.post('/procedures', newEntry);
      await axios.post('/appointments', {
        name: patient.name,
        birth: patient.birth,
        reservationDate: date,
        time,
        department,
        doctor,
        memo,
        phone: patient.phone || '-',
        gender: patient.gender || '-',
        status: '대기'
      });
      setProcedures([newEntry, ...procedures]);
      setFormData({ title: '', date: '', doctor: '', doctorId: '', memo: '', department: '', time: '' });
      setShowForm(false);
      fetchEvents?.();
    } catch (err) {
      console.error('시술 추가 실패', err);
      alert('시술 또는 예약 등록 실패');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">{patient?.name} ({patient?.birth}) 시술 이력</h3>

        {procedures.length === 0 ? (
          <p className="text-gray-500">등록된 시술 이력이 없습니다.</p>
        ) : (
          <ul className="border-l-4 border-blue-500 pl-4 space-y-4">
            {procedures.map((p, i) => (
              <li key={i} className="relative">
                <div className="absolute -left-3 top-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                <h4 className="text-blue-600 font-semibold text-sm mb-1">{p.title}</h4>
                <div className="text-xs text-gray-600">
                  <p>담당의사: {p.doctor || '-'}</p>
                  <p>진료과: {p.department || '-'}</p>
                  <p>시술 시간: {p.time || '-'}</p>
                  <p>시술일자: {p.date ? new Date(p.date).toLocaleDateString('ko-KR') : '-'}</p>
                  <p>등록일자: {p.createdAt ? new Date(p.createdAt).toLocaleString('ko-KR') : '-'}</p>
                </div>
                {p.memo && <p className="bg-gray-50 text-sm mt-2 p-2 rounded">{p.memo}</p>}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {showForm ? '입력 취소' : '+ 시술 추가'}
        </button>

        {showForm && (
          <div className="mt-6 space-y-3">
            <select
              className="w-full p-2 border rounded"
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value, title: '', doctor: '', time: '' })}
            >
              <option value="">진료과 선택</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {formData.department && (
              <>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                >
                  <option value="">시술명 선택</option>
                  {PROCEDURE_MAP[formData.department].map(title => <option key={title} value={title}>{title}</option>)}
                </select>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.doctor}
                  onChange={e => setFormData({ ...formData, doctor: e.target.value })}
                >
                  <option value="">담당의 선택</option>
                  {DOCTOR_MAP[formData.department].map(doc => <option key={doc} value={doc}>{doc}</option>)}
                </select>
              </>
            )}
            <input
              className="w-full p-2 border rounded"
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value, time: '' })}
            />
            {formData.department && formData.date && (
              <>
                <div>
                  <p className="font-semibold text-blue-600 mb-1">오전</p>
                  <div className="grid grid-cols-3 gap-2">
                    {am.map(t => (
                      <button
                        key={t}
                        type="button"
                        disabled={reservedTimes.includes(t)}
                        className={`rounded px-3 py-2 text-sm font-semibold ${
                          reservedTimes.includes(t)
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : formData.time === t
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-800 border'
                        }`}
                        onClick={() => !reservedTimes.includes(t) && setFormData({ ...formData, time: t })}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-blue-600 mt-3 mb-1">오후</p>
                  <div className="grid grid-cols-3 gap-2">
                    {pm.map(t => (
                      <button
                        key={t}
                        type="button"
                        disabled={reservedTimes.includes(t)}
                        className={`rounded px-3 py-2 text-sm font-semibold ${
                          reservedTimes.includes(t)
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : formData.time === t
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-800 border'
                        }`}
                        onClick={() => !reservedTimes.includes(t) && setFormData({ ...formData, time: t })}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <textarea
              className="w-full p-2 border rounded"
              placeholder="시술 메모 또는 설명"
              value={formData.memo}
              onChange={e => setFormData({ ...formData, memo: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded">추가</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-500 text-white rounded">취소</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcedureModal;
