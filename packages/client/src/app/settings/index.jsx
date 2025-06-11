import React, { useState } from 'react';
import { useHospitalInfo } from '@/contexts/HospitalContext';
import { useNavigate } from 'react-router-dom';
import { updateHospitalInfo } from '@/api/hospital';

const GeneralSettings = () => {
  const { hospitalInfo, setHospitalInfo } = useHospitalInfo();
  const [editMode, setEditMode] = useState(false);
  const [hospital, setHospital] = useState({ ...hospitalInfo });
  const [system, setSystem] = useState({ notify: 'ON', interval: 15, emr: '사용' });
  const navigate = useNavigate();

  const saveHospitalInfo = async () => {
    try {
      await updateHospitalInfo(hospital);
      setHospitalInfo({ ...hospital });
      setEditMode(false);
      alert('병원 정보가 저장되었습니다.');
    } catch (err) {
      console.error(err);
      alert('저장에 실패했습니다.');
    }
  };

  const cancelEdit = () => {
    setHospital({ ...hospitalInfo });
    setEditMode(false);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">⚙️ 전체 설정</h2>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate('/Dashboard/hospital-info')}
        >
          병원 정보 관리
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate('/Dashboard/user-permissions')}
        >
          사용자 권한 관리
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">🔧 시스템 설정</h3>

        <div className="mb-4">
          <label className="block font-semibold mb-1">알림 수신</label>
          <select
            value={system.notify}
            onChange={e => setSystem({ ...system, notify: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option>ON</option>
            <option>OFF</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">진료 예약 간격 (분)</label>
          <input
            type="number"
            value={system.interval}
            onChange={e => setSystem({ ...system, interval: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-1">EMR 연동</label>
          <select
            value={system.emr}
            onChange={e => setSystem({ ...system, emr: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option>사용</option>
            <option>미사용</option>
          </select>
        </div>

        <button
          onClick={saveHospitalInfo}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          시스템 설정 저장
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings;
