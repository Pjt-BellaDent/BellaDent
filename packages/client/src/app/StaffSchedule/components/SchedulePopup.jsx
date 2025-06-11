import React, { useState, useEffect } from 'react';

const SchedulePopup = ({ open, onClose, onSave, initialData = null }) => {
  const [form, setForm] = useState({
    rank: '',
    name: '',
    time: '',
    memo: '',
    off: false
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ rank: '', name: '', time: '', memo: '', off: false });
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    if (!form.rank || !form.name || !form.time) {
      alert('직급, 이름, 시간을 모두 입력해주세요.');
      return;
    }
    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-[320px] p-5 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">{initialData ? '스케줄 수정' : '스케줄 등록'}</h3>

        <div className="mb-4">
          <label className="block mb-1 text-sm">직급</label>
          <select className="w-full border rounded px-3 py-2 text-sm" value={form.rank} onChange={e => setForm({ ...form, rank: e.target.value })}>
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
          <label className="block mb-1 text-sm">이름</label>
          <input className="w-full border rounded px-3 py-2 text-sm" type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm">시간</label>
          <input className="w-full border rounded px-3 py-2 text-sm" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm">메모</label>
          <textarea className="w-full border rounded px-3 py-2 text-sm resize-y h-24" value={form.memo} onChange={e => setForm({ ...form, memo: e.target.value })} />
        </div>

        <div className="flex items-center mb-4">
          <input id="off" type="checkbox" className="mr-2" checked={form.off} onChange={e => setForm({ ...form, off: e.target.checked })} />
          <label htmlFor="off" className="text-sm">휴무</label>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
            {initialData ? '수정' : '등록'}
          </button>
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded text-sm">
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulePopup;
