import React, { useState } from 'react';
import { useHospitalInfo } from '../../../contexts/HospitalContext';

const HospitalInfo = () => {
  const { hospitalInfo, setHospitalInfo } = useHospitalInfo();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...hospitalInfo });

  const handleSave = () => {
    setHospitalInfo(form);
    localStorage.setItem('hospitalInfo', JSON.stringify(form));
    setEditMode(false);
    alert('병원 정보가 수정되었습니다.');
  };

  const fields = {
    name: '병원명',
    address: '주소',
    ceo: '대표자명',
    bizNumber: '사업자등록번호',
    phone: '연락처'
  };

  return (
    <div className="flex gap-8 p-8">
      <div className="flex-1 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">🏥 병원 정보</h3>
        {Object.entries(fields).map(([key, label]) => (
          <div key={key} className="mb-4">
            <label className="block font-semibold mb-1">{label}</label>
            <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
              {hospitalInfo[key] || ''}
            </div>
          </div>
        ))}
        <button
          onClick={() => setEditMode(true)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          수정
        </button>
      </div>

      {editMode && (
        <div className="w-80 bg-gray-50 p-6 border border-gray-300 rounded-lg">
          <h4 className="text-lg font-semibold mb-4">병원 정보 수정</h4>
          {Object.entries(fields).map(([key, label]) => (
            <div key={key} className="mb-4">
              <label className="block font-semibold mb-1">{label}</label>
              <input
                type="text"
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              저장
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalInfo;
