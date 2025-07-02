// src/components/app/patients/SurveyModal.jsx
import React, { useState } from 'react';

const SurveyModal = ({ open, onClose, patient }) => {
  const [form, setForm] = useState({
    q1: '3',
    q2: '3',
    q3: '3',
    comment: '',
  });

  const handleSubmit = () => {
    if (!patient || !patient.name || !patient.birth) {
      alert('환자 정보(이름, 생년월일)가 없습니다.');
      return;
    }

    const data = {
      name: patient.name,
      birth: patient.birth,
      ...form,
      date: new Date().toISOString().slice(0, 10),
    };

    const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
    surveys.push(data);
    localStorage.setItem('surveys', JSON.stringify(surveys));

    alert('설문이 저장되었습니다. 감사합니다!');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white p-6 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">
          📝 진료 만족도 조사 -{' '}
          {patient ? `${patient.name} (${patient.birth})` : '환자 정보 없음'}
        </h3>

        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium">1. 의료진의 설명이 충분했나요?</p>
            {[1, 2, 3, 4, 5].map((val) => (
              <label key={`q1-${val}`} className="mr-4">
                <input
                  type="radio"
                  name="q1"
                  value={val}
                  checked={form.q1 === String(val)}
                  onChange={(e) => setForm({ ...form, q1: e.target.value })}
                />{' '}
                {val}점
              </label>
            ))}
          </div>

          <div>
            <p className="font-medium">2. 대기 시간은 어땠나요?</p>
            {[1, 2, 3, 4, 5].map((val) => (
              <label key={`q2-${val}`} className="mr-4">
                <input
                  type="radio"
                  name="q2"
                  value={val}
                  checked={form.q2 === String(val)}
                  onChange={(e) => setForm({ ...form, q2: e.target.value })}
                />{' '}
                {val}점
              </label>
            ))}
          </div>

          <div>
            <p className="font-medium">3. 전반적인 만족도는?</p>
            {[1, 2, 3, 4, 5].map((val) => (
              <label key={`q3-${val}`} className="mr-4">
                <input
                  type="radio"
                  name="q3"
                  value={val}
                  checked={form.q3 === String(val)}
                  onChange={(e) => setForm({ ...form, q3: e.target.value })}
                />{' '}
                {val}점
              </label>
            ))}
          </div>

          <div>
            <textarea
              name="comment"
              placeholder="의견을 적어주세요"
              className="w-full p-2 border rounded mt-2"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            ></textarea>
          </div>

          <div className="text-right">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              제출
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyModal;
