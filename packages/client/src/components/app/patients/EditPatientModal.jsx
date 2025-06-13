// src/app/patients/components/EditPatientModal.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../../libs/axiosIntance';

const EditPatientModal = ({ open, onClose, patientData, procedures }) => {
  const [form, setForm] = useState({ ...patientData });
  const [editedProcedures, setEditedProcedures] = useState([...procedures]);

  useEffect(() => {
    setForm({ ...patientData });
    setEditedProcedures([...procedures]);
  }, [patientData, procedures]);

  const updateProcedure = (index, key, value) => {
    const newList = [...editedProcedures];
    newList[index][key] = value;
    setEditedProcedures(newList);
  };

  const handleSave = async () => {
    try {
      await axios.put(`/patients/${form.userId}`, {
        ...form,
        procedures: editedProcedures.map(proc => ({
          ...proc,
          name: form.name,
          birth: form.birth,
        })),
        lastVisit: form.lastVisit || new Date().toISOString().slice(0, 10)
      });
      alert('환자 정보가 저장되었습니다.');
      onClose();
    } catch (err) {
      console.error("저장 실패:", err);
      alert('저장에 실패했습니다.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">환자 정보 수정</h3>

        <label className="font-semibold">이름</label>
        <input className="w-full p-2 border rounded mb-3" value={form.name} disabled />

        <label className="font-semibold">생년월일</label>
        <input className="w-full p-2 border rounded mb-3" value={form.birth || ''} disabled />

        <label className="font-semibold">성별</label>
        <select
          className="w-full p-2 border rounded mb-3"
          value={form.gender}
          onChange={e => setForm({ ...form, gender: e.target.value })}
        >
          <option value="">선택</option>
          <option value="남">남</option>
          <option value="여">여</option>
        </select>

        <label className="font-semibold">나이</label>
        <input className="w-full p-2 border rounded mb-3" value={form.age || ''} onChange={e => setForm({ ...form, age: e.target.value })} />

        <label className="font-semibold">전화번호</label>
        <input className="w-full p-2 border rounded mb-3" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />

        <label className="font-semibold">진료과</label>
        <select
          className="w-full p-2 border rounded mb-3"
          value={form.department || ''}
          onChange={e => setForm({ ...form, department: e.target.value })}
        >
          <option value="">선택</option>
          <option value="보철과">보철과</option>
          <option value="교정과">교정과</option>
          <option value="치주과">치주과</option>
        </select>

        <label className="font-semibold">상태</label>
        <select
          className="w-full p-2 border rounded mb-3"
          value={form.status || ''}
          onChange={e => setForm({ ...form, status: e.target.value })}
        >
          <option value="">선택</option>
          <option value="예약">예약</option>
          <option value="대기">대기</option>
          <option value="진료완료">진료완료</option>
        </select>

        <h4 className="text-lg font-bold mt-6 mb-2">과거 시술 이력</h4>
        {editedProcedures.map((proc, i) => (
          <div key={i} className="mb-4 border-b pb-4">
            <label className="font-semibold">시술명</label>
            <input className="w-full p-2 border rounded mb-2" value={proc.title} onChange={e => updateProcedure(i, 'title', e.target.value)} />
            <label className="font-semibold">날짜</label>
            <input className="w-full p-2 border rounded mb-2" type="datetime-local" value={proc.date} onChange={e => updateProcedure(i, 'date', e.target.value)} />
            <label className="font-semibold">의료진</label>
            <input className="w-full p-2 border rounded mb-2" value={proc.doctor} onChange={e => updateProcedure(i, 'doctor', e.target.value)} />
            <label className="font-semibold">비고</label>
            <textarea className="w-full p-2 border rounded" value={proc.note} onChange={e => updateProcedure(i, 'note', e.target.value)} />
          </div>
        ))}

        <div className="text-right mt-4">
          <button className="px-4 py-2 bg-gray-400 text-white rounded mr-2" onClick={onClose}>취소</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
};

export default EditPatientModal;
