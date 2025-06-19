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
    if (!form.birth || !form.gender) {
      alert('생년월일과 성별은 필수 입력값입니다.');
      return;
    }
    try {
      await axios.put(`/patients/${form.userId}`, {
        ...form,
        procedures: editedProcedures.map(proc => ({
          ...proc,
          name: form.name,
          birth: form.birth,
        })),
        lastVisitDate: form.lastVisitDate || new Date().toISOString().slice(0, 10)
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

        <label className="font-semibold">전화번호</label>
        <input className="w-full p-2 border rounded mb-3" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />

        <div className="text-right mt-4">
          <button className="px-4 py-2 bg-gray-400 text-white rounded mr-2" onClick={onClose}>취소</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
};

export default EditPatientModal;
