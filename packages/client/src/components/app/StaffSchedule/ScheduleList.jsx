import React from 'react';

const ScheduleList = ({ selectedDate, scheduleData, onDelete, onOpenPopup, onEdit }) => {
  if (!selectedDate) {
    return (
      <div className="bg-white mt-5 p-5 rounded-lg shadow text-sm">
        <h4>📅 날짜를 클릭해 스케줄을 확인하세요.</h4>
      </div>
    );
  }

  const key = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const list = scheduleData[key] || [];

  return (
    <div className="bg-white mt-5 p-5 rounded-lg shadow text-sm">
      <h3 className="text-base font-semibold mb-4">{key} 스케줄 목록</h3>
      {list.length === 0 ? (
        <p className="text-gray-500">등록된 스케줄이 없습니다.</p>
      ) : (
        list.map((item) => (
          <div key={item.id} className="flex justify-between items-start border-b border-gray-100 py-3">
            <div>
              <p className="mb-1">👤 {item.rank} {item.name} | 🕒 {item.time} {item.off ? '🌙휴무' : ''}</p>
              <p className="text-gray-600">📝 {item.memo || '메모 없음'}</p>
            </div>
            <div className="flex gap-2 text-sm">
              <button
                className="bg-yellow-400 text-black px-3 py-1 rounded text-xs font-medium"
                onClick={() => onEdit(item)}
              >수정</button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium"
                onClick={() => onDelete(item.id)}
              >삭제</button>
            </div>
          </div>
        ))
      )}
      <button
        onClick={onOpenPopup}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded text-sm font-semibold"
      >
        + 스케줄 추가
      </button>
    </div>
  );
};

export default ScheduleList;
