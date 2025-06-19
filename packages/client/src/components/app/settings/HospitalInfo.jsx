import React, { useState } from 'react';
import { useHospitalInfo } from '../../../contexts/HospitalContext';

const HospitalInfo = () => {
  const { hospitalInfo, setHospitalInfo, loading } = useHospitalInfo();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...hospitalInfo });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await setHospitalInfo(form);
    setSaving(false);
    setEditMode(false);
    alert('병원 정보가 수정되었습니다.');
  };

  const fields = {
    name: '병원명',
    address: '주소',
    ceo: '대표자명',
    bizNumber: '사업자등록번호',
    phone: '연락처',
    homepage: '홈페이지',
  };

  // 진료시간, 진료과목 등 추가 필드
  const openHourFields = {
    weekday: '평일 진료시간',
    saturday: '토요일 진료시간',
    lunch: '점심시간',
    holiday: '공휴일'
  };

  if (loading) return <div className="p-8">로딩 중...</div>;

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
        {/* 진료시간 */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">진료시간</label>
          <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
            {Object.entries(openHourFields).map(([k, v]) => (
              <div key={k} className="flex gap-2 text-sm">
                <span className="w-24 inline-block text-gray-600">{v}</span>
                <span>{hospitalInfo.openHours?.[k] || ''}</span>
              </div>
            ))}
          </div>
        </div>
        {/* 진료과목 */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">진료과목</label>
          <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
            {(hospitalInfo.departments || []).join(', ')}
          </div>
        </div>
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
                value={form[key] || ''}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          ))}
          {/* 진료시간 입력 */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">진료시간</label>
            {Object.entries(openHourFields).map(([k, v]) => (
              <div key={k} className="mb-2">
                <span className="inline-block w-24 text-gray-600">{v}</span>
                <input
                  type="text"
                  value={form.openHours?.[k] || ''}
                  onChange={e => setForm({
                    ...form,
                    openHours: { ...form.openHours, [k]: e.target.value }
                  })}
                  className="w-40 border border-gray-300 rounded px-2 py-1 ml-2"
                />
              </div>
            ))}
          </div>
          {/* 진료과목 입력 */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">진료과목 (쉼표로 구분)</label>
            <input
              type="text"
              value={(form.departments || []).join(', ')}
              onChange={e => setForm({
                ...form,
                departments: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? '저장 중...' : '저장'}
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
