// src/app/patients/components/EditPatientModal.jsx

import React, { useState, useEffect } from 'react';
import axios from '../../../libs/axiosInstance.js';

// 폼 초기화를 위한 기본값 정의
const INITIAL_FORM = {
  name: '',
  birth: '',
  gender: '',
  phone: '',
  address: '',
  userId: '',
  insuranceNumber: '',
  allergies: '',
  medications: '',
  memo: '',
};

const EditPatientModal = ({ open, onClose, patientData, procedures }) => {
  // ★★★ useState 초기화를 안전하게 변경 ★★★
  // patientData가 null 또는 undefined일 경우 INITIAL_FORM으로 초기화
  const [form, setForm] = useState(() =>
    patientData
      ? {
          name: patientData.name || '',
          birth: patientData.birth || '',
          gender: patientData.gender || '',
          phone: patientData.phone || '',
          address: patientData.address || '',
          userId: patientData.id || '', // id는 항상 있을 것이므로 nullish coalescing 불필요할 수 있지만 안전하게
          insuranceNumber: patientData.patientInfo?.insuranceNumber || '',
          allergies: patientData.patientInfo?.allergies || '',
          medications: patientData.patientInfo?.medications || '',
          memo: patientData.patientInfo?.memo || '',
        }
      : INITIAL_FORM
  ); // patientData가 없을 때는 INITIAL_FORM으로 초기화

  // procedures 상태는 이 모달에서 직접 수정하지 않는다면 필요 없음 (주석 처리 또는 삭제)
  // const [editedProcedures, setEditedProcedures] = useState([]);

  useEffect(() => {
    // ★★★ patientData가 유효할 때만 폼을 업데이트하도록 변경 ★★★
    if (patientData) {
      setForm({
        name: patientData.name || '',
        birth: patientData.birth || '',
        gender: patientData.gender || '',
        phone: patientData.phone || '',
        address: patientData.address || '',
        userId: patientData.id || '',
        insuranceNumber: patientData.patientInfo?.insuranceNumber || '',
        allergies: patientData.patientInfo?.allergies || '',
        medications: patientData.patientInfo?.medications || '',
        memo: patientData.patientInfo?.memo || '',
      });
      // setEditedProcedures([...procedures]); // 이 모달에서 시술 내역을 직접 수정하지 않는다면 이 라인 제거
    } else {
      // patientData가 null/undefined가 되면 폼을 초기화 (모달 닫힐 때 등)
      setForm(INITIAL_FORM);
    }
  }, [patientData]); // procedures는 이제 의존성에서 제거

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // 클라이언트 측 유효성 검증 강화
    if (!form.name.trim()) {
      alert('이름은 필수 입력값입니다.');
      return;
    }
    if (!form.birth.trim()) {
      alert('생년월일은 필수 입력값입니다.');
      return;
    }
    if (!form.gender.trim()) {
      alert('성별은 필수 입력값입니다.');
      return;
    }
    if (!form.phone.trim()) {
      alert('전화번호는 필수 입력값입니다.');
      return;
    }

    try {
      const payload = {
        name: form.name,
        birth: form.birth,
        gender: form.gender,
        phone: form.phone,
        address: form.address,
        patientInfo: {
          insuranceNumber: form.insuranceNumber,
          allergies: form.allergies,
          medications: form.medications,
          memo: form.memo,
        },
      };

      await axios.put(`/users/patient/${form.userId}`, payload);
      alert('환자 정보가 저장되었습니다.');
      onClose(); // 저장 성공 시 모달 닫기
    } catch (err) {
      console.error('저장 실패:', err.response?.data || err.message);
      alert(
        '저장에 실패했습니다: ' +
          (err.response?.data?.message || '알 수 없는 오류')
      );
    }
  };

  // 모달이 열려있지 않거나 patientData가 없을 때는 렌더링하지 않음
  if (!open || !patientData) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">환자 정보 수정</h3>

        <label className="font-semibold">이름</label>
        <input
          className="w-full p-2 border rounded mb-3"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <label className="font-semibold">생년월일</label>
        <input
          className="w-full p-2 border rounded mb-3"
          type="date"
          name="birth"
          value={form.birth || ''}
          onChange={handleChange}
        />

        <label className="font-semibold">성별</label>
        <select
          className="w-full p-2 border rounded mb-3"
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
          <option value="">선택</option>
          <option value="M">남</option>
          <option value="F">여</option>
        </select>

        <label className="font-semibold">전화번호</label>
        <input
          className="w-full p-2 border rounded mb-3"
          name="phone"
          value={form.phone || ''}
          onChange={handleChange}
        />

        <label className="font-semibold">주소</label>
        <input
          className="w-full p-2 border rounded mb-3"
          name="address"
          value={form.address || ''}
          onChange={handleChange}
          placeholder="환자의 주소를 입력하세요"
        />

        <label className="font-semibold">건강보험 번호</label>
        <input
          className="w-full p-2 border rounded mb-3"
          name="insuranceNumber"
          value={form.insuranceNumber || ''}
          onChange={handleChange}
          placeholder="건강보험 번호를 입력하세요"
        />

        <label className="font-semibold">알레르기 정보</label>
        <textarea
          className="w-full p-2 border rounded mb-3 h-24 resize-y"
          name="allergies"
          value={form.allergies || ''}
          onChange={handleChange}
          placeholder="알레르기 정보를 입력하세요"
        ></textarea>

        <label className="font-semibold">복약 정보</label>
        <textarea
          className="w-full p-2 border rounded mb-3 h-24 resize-y"
          name="medications"
          value={form.medications || ''}
          onChange={handleChange}
          placeholder="복용 중인 약물 정보를 입력하세요"
        ></textarea>

        <label className="font-semibold">환자 메모</label>
        <textarea
          className="w-full p-2 border rounded mb-3 h-24 resize-y"
          name="memo"
          value={form.memo || ''}
          onChange={handleChange}
          placeholder="환자 관련 특이사항을 입력하세요"
        ></textarea>

        <div className="text-right mt-4">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPatientModal;
