import React, { useState, useEffect } from 'react';

const SchedulePopup = ({ open, onClose, onSave, initialData = null }) => {
  const [form, setForm] = useState({
    rank: '',
    name: '',
    time: '',
    memo: '',
    off: false,
    scheduleDate: '',
    staffId: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        staffId: initialData.staffId || ''
      });
    } else {
      setForm({ 
        rank: '', 
        name: '', 
        time: '', 
        memo: '', 
        off: false,
        scheduleDate: '',
        staffId: ''
      });
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    if (!form.rank || !form.name) {
      alert('직급과 이름을 입력해주세요.');
      return;
    }
    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg w-[400px] shadow-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-4 py-3">
          <h3 className="text-lg font-medium">{initialData?.id ? '스케줄 수정' : '스케줄 등록'}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>
            {`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">직급</label>
            <select 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
              value={form.rank} 
              onChange={e => setForm({ ...form, rank: e.target.value })}
            >
              <option value="">선택</option>
              <option value="원장">원장</option>
              <option value="부원장">부원장</option>
              <option value="과장">과장</option>
              <option value="상담사">상담사</option>
              <option value="수납">수납</option>
              <option value="치위생사">치위생사</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">이름</label>
            <input 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
              type="text" 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">시간</label>
            <input 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
              type="time" 
              value={form.time} 
              onChange={e => setForm({ ...form, time: e.target.value })} 
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">직원 ID</label>
            <input 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
              type="text" 
              value={form.staffId} 
              onChange={e => setForm({ ...form, staffId: e.target.value })} 
              placeholder="직원 ID를 입력하세요 (선택사항)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">메모</label>
            <textarea 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-y h-24" 
              value={form.memo} 
              onChange={e => setForm({ ...form, memo: e.target.value })} 
            />
          </div>

          <div className="flex items-center mb-4">
            <input 
              id="off" 
              type="checkbox" 
              className="mr-2" 
              checked={form.off} 
              onChange={e => setForm({ ...form, off: e.target.checked })} 
            />
            <label htmlFor="off" className="text-sm text-gray-700">휴무</label>
          </div>

          <div className="flex justify-end gap-2">
            <button 
              onClick={handleSubmit} 
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              {initialData ? '수정' : '등록'}
            </button>
            <button 
              onClick={onClose} 
              className="bg-gray-400 text-white px-4 py-2 rounded text-sm hover:bg-gray-500 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePopup;
