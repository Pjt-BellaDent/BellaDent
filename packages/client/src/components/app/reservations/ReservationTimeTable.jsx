// ReservationTimeTable.jsx (Tailwind 버전)
import React, { useState } from 'react';

const departments = ['보철과', '교정과', '치주과'];
const times = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const isTimeInReservation = (res, time) => {
  if (!res.startTime) return false;
  const idxStart = times.indexOf(res.startTime);
  const idxEnd = res.endTime ? times.indexOf(res.endTime) : idxStart;
  const idx = times.indexOf(time);
  return idx >= idxStart && idx <= idxEnd;
};

function ReservationTimeTable({ date, events = {}, onEdit, onDelete, onAdd }) {
  const [detailData, setDetailData] = useState(null);
  const dayEvents = events[date] || [];

  const getReservation = (dept, time) =>
    dayEvents.find(res => res.department === dept && isTimeInReservation(res, time));

  if (!date) return <div className="text-gray-500 mt-10">왼쪽 달력에서 날짜를 선택하세요.</div>;

  return (
    <>
      <div className="flex justify-end gap-2 mb-4">
        <button
          className="bg-[#f2f4f8] text-[#2071e5] rounded-md px-4 py-2 font-semibold text-sm"
          onClick={() => window.location.href = "/Dashboard/reservations/list"}
        >
          예약 목록
        </button>
        <button
          className="bg-[#2071e5] text-white rounded-md px-4 py-2 font-semibold text-sm"
          onClick={() => onAdd()}
        >
          + 예약 등록
        </button>
      </div>
      <table className="w-full border-collapse table-fixed text-[15px]">
        <thead>
          <tr>
            <th className="bg-[#f7fafd] text-[#2071e5] font-bold border border-[#e8e8e8] px-3 py-2">시간</th>
            {departments.map(dept => (
              <th key={dept} className="bg-[#f7fafd] text-[#2071e5] font-bold border border-[#e8e8e8] px-3 py-2">
                {dept}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map(time => (
            <tr key={time}>
              <td className="border border-[#e8e8e8] px-3 py-2 text-center">{time}</td>
              {departments.map(dept => {
                const res = getReservation(dept, time);
                return (
                  <td key={dept} className="border border-[#e8e8e8] px-3 py-2 text-center">
                    {res ? (
                      <div className="inline-flex items-center justify-center gap-1 flex-wrap text-[14px]">
                        <span
                          className="font-semibold text-[#2071e5] underline cursor-pointer"
                          onClick={() => setDetailData(res)}
                        >
                          {res.name}
                          {res.birth && (
                            <span className="text-[13px] text-gray-500 ml-1">
                              ({res.birth})
                            </span>
                          )}
                        </span>
                        <button
                          className="bg-[#ffd542] text-[#444] rounded px-2 py-[2px] text-[13px] font-semibold"
                          onClick={() => onEdit(res)}
                        >수정</button>
                        <button
                          className="bg-[#f36c65] text-white rounded px-2 py-[2px] text-[13px] font-semibold"
                          onClick={() => onDelete(res.id)}
                        >삭제</button>
                      </div>
                    ) : (
                      <span
                        className="text-gray-400 text-[13px] underline cursor-pointer"
                        onClick={() => onAdd({ department: dept, startTime: time, endTime: time })}
                      >
                        예약 없음
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {detailData && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 z-[2000] flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 min-w-[340px] max-w-[420px]">
            <h3 className="text-xl font-bold mb-4">환자 상세 정보</h3>
            <div className="mb-2"><b>이름</b>: {detailData.name}</div>
            <div className="mb-2"><b>생년월일</b>: {detailData.birth ? (() => {
              const [year, month, day] = detailData.birth.split('-');
              return `${year}년 ${month}월 ${day}일`;
            })() : '-'}</div>
            <div className="mb-2"><b>연락처</b>: {detailData.phone || '-'}</div>
            <div className="mb-2"><b>성별</b>: {detailData.gender || '-'}</div>
            <div className="mb-2"><b>진료과</b>: {detailData.department}</div>
            <div className="mb-2"><b>의사</b>: {detailData.doctor}</div>
            <div className="mb-2"><b>시술</b>: {detailData.title}</div>
            <div className="mb-2"><b>상태</b>: {detailData.status}</div>
            <div className="mb-2"><b>메모</b>: {detailData.memo || '-'}</div>
            <button
              className="bg-[#2071e5] text-white rounded-md px-6 py-2 font-semibold text-sm mt-4"
              onClick={() => setDetailData(null)}
            >닫기</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ReservationTimeTable;
