import React, { useState } from 'react';

const ChatbotSettings = () => {
  const defaultAnswers = {
    접수: '진료 접수는 방문 또는 전화로 가능합니다.',
    예약: '예약 변경은 24시간 전에 연락 주시면 처리됩니다.',
    검사: '검사 결과는 진료 후 마이페이지에서 확인 가능합니다.',
    진료비: '진료비는 시술 항목에 따라 상이하니 전화문의 주세요.',
    시간: '평일 9시~18시 / 토요일 9시~13시 운영, 일요일/공휴일 휴무입니다.'
  };

  const [toggles, setToggles] = useState({
    접수: true,
    예약: false,
    검사: true,
    진료비: false,
    시간: true
  });

  const [answers, setAnswers] = useState(defaultAnswers);
  const [editBuffer, setEditBuffer] = useState(defaultAnswers);
  const [selectedKey, setSelectedKey] = useState('시간');

  const toggleChange = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEditClick = (key) => {
    setSelectedKey(key);
    setEditBuffer(prev => ({ ...prev, [key]: answers[key] }));
  };

  const handleAnswerChange = (key, value) => {
    setEditBuffer(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (key) => {
    setAnswers(prev => ({ ...prev, [key]: editBuffer[key] }));
    setSelectedKey(null);
  };

  const handleCancel = (key) => {
    setEditBuffer(prev => ({ ...prev, [key]: answers[key] }));
    setSelectedKey(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">⚙️ AI 챗봇 설정</h2>

      <div className="flex gap-6">
        <div className="flex-[2] bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">자주 묻는 질문 설정</h3>
          {Object.entries({
            접수: '진료 접수 방법',
            예약: '예약 변경 방법',
            검사: '검사 결과 조회',
            진료비: '진료비 문의',
            시간: '진료 시간'
          }).map(([key, label]) => (
            <div key={key} className="border-b border-gray-200 py-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{label}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(key)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                  >
                    답변 편집
                  </button>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={toggles[key]} onChange={() => toggleChange(key)} />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>
              </div>
              {selectedKey === key && (
                <div className="mt-3">
                  <textarea
                    value={editBuffer[key]}
                    onChange={(e) => handleAnswerChange(key, e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => handleCancel(key)} className="px-4 py-1 text-sm border rounded hover:bg-gray-100">취소</button>
                    <button onClick={() => handleSave(key)} className="px-4 py-1 text-sm bg-blue-600 text-white rounded">저장</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-lg shadow p-6 h-fit">
          <h4 className="font-semibold mb-3">💬 고객에게 보이는 응답 예시</h4>
          <div className="border p-4 rounded bg-gray-50 text-sm">
            <strong>질문:</strong> {selectedKey ? `${selectedKey} 관련 질문` : ''}<br /><br />
            <strong>AI 답변:</strong><br />
            {answers[selectedKey]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotSettings;
