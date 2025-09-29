// src/components/app/StaffSchedule/SchedulePopup.jsx
import React, { useState, useEffect } from 'react';

const SchedulePopup = ({
  open,
  onClose,
  onSave,
  initialData = null,
  staffList = [],
  selectedStaffId,
  selectedDate,
}) => {
  const [form, setForm] = useState({
    position: '',
    name: '',
    uid: '',
    department: '',
    startTime: '',
    endTime: '',
    memo: '',
    off: false,
    scheduleDate: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        uid: initialData.uid || '',
        position: initialData.position || '',
        name: initialData.name || '',
        department: initialData.department || '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        scheduleDate: initialData.scheduleDate || '',
      });
    } else if (selectedStaffId && selectedStaffId !== '전체') {
      const staff = staffList.find((s) => s.uid === selectedStaffId);
      setForm((prev) => ({
        ...prev,
        uid: staff?.uid || '',
        name: staff?.name || '',
        position: staff?.position || '',
        department: staff?.department || '',
        scheduleDate: selectedDate
          ? `${selectedDate.getFullYear()}-${String(
              selectedDate.getMonth() + 1
            ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(
              2,
              '0'
            )}`
          : '',
      }));
    } else {
      setForm({
        position: '',
        name: '',
        uid: '',
        department: '',
        startTime: '',
        endTime: '',
        memo: '',
        off: false,
        scheduleDate: selectedDate
          ? `${selectedDate.getFullYear()}-${String(
              selectedDate.getMonth() + 1
            ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(
              2,
              '0'
            )}`
          : '',
      });
    }
  }, [initialData, open, selectedStaffId, selectedDate, staffList]);

  const handleStaffChange = (e) => {
    const selectedUid = e.target.value;
    const staff = staffList.find((s) => s.uid === selectedUid);
    if (staff) {
      setForm((prev) => ({
        ...prev,
        uid: staff.uid,
        name: staff.name,
        position: staff.position,
        department: staff.department,
      }));
    }
  };

  const handleSubmit = () => {
    if (!form.uid || !form.name || !form.position) {
      alert('직원을 선택해주세요.');
      return;
    }
    onSave(form);
  };

  const isEdit = !!form.id;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg w-[400px] shadow-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-4 py-3">
          <h3 className="text-lg font-medium">
            {isEdit ? '스케줄 수정' : '스케줄 등록'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          className="p-4 overflow-y-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">직원</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              value={form.uid}
              onChange={handleStaffChange}
            >
              <option value="">직원 선택</option>
              {staffList.length > 0 ? (
                staffList.map((staff) => (
                  <option key={staff.uid} value={staff.uid}>
                    {staff.name} ({staff.position}/{staff.department})
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  직원 목록을 불러오는 중...
                </option>
              )}
            </select>
            {staffList.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                직원 목록을 불러올 수 없습니다.
              </p>
            )}
          </div>
          <div className="mb-4 flex gap-2">
            <div className="flex-1">
              <label className="block text-sm text-gray-700 mb-1">
                시작 시간
              </label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-700 mb-1">
                종료 시간
              </label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">메모</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-y h-24"
              value={form.memo}
              onChange={(e) => setForm({ ...form, memo: e.target.value })}
            />
          </div>
          <div className="flex items-center mb-4">
            <input
              id="off"
              type="checkbox"
              className="mr-2"
              checked={form.off}
              onChange={(e) => setForm({ ...form, off: e.target.checked })}
            />
            <label htmlFor="off" className="text-sm text-gray-700">
              휴무
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              {isEdit ? '수정' : '등록'}
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
