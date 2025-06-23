import React from 'react';

const ScheduleList = ({ selectedDate, scheduleData, onDelete, onOpenPopup, onEdit, filterStaffId }) => {
  if (!selectedDate) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 h-full flex items-center justify-center">
        <h4 className="text-gray-500 text-center">📅 날짜를 클릭해 스케줄을 확인하세요.</h4>
      </div>
    );
  }

  const key = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  let list = scheduleData[key] || [];

  if (filterStaffId !== '전체') {
    list = list.filter(e => (e.uid === filterStaffId));
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{key} 스케줄 목록</h3>
        <button
          onClick={onOpenPopup}
          className="px-4 py-2 bg-green-500 text-white rounded text-sm font-semibold hover:bg-green-600"
        >
          + 스케줄 추가
        </button>
      </div>

      {list.length === 0 ? (
        <p className="text-gray-500 text-center py-4">등록된 스케줄이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {list.map((item) => (
            <div key={item.uid} className="flex justify-between items-start bg-gray-50 rounded-lg p-4 hover:bg-gray-100">
              <div>
                <p className="text-gray-900">
                  <span className="font-semibold">{item.position}</span> {item.name}
                  {item.startTime && item.endTime && (
                    <span className="mx-2 text-blue-600">{item.startTime}~{item.endTime}</span>
                  )}
                  {item.off && <span className="ml-2 text-red-500">🌙 휴무</span>}
                </p>
                {item.memo && (
                  <p className="text-gray-600 mt-1 text-sm">
                    📝 {item.memo}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-1 bg-yellow-400 text-black rounded text-sm font-medium hover:bg-yellow-500"
                >
                  수정
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleList;
