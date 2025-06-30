import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addWaitingPatient } from '../../../api/patients'; // addWaitingPatient는 그대로 사용
import axios from '../../../libs/axiosInstance.js'; // axiosInstance는 그대로 사용

const times = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const isTimeInReservation = (res, time) => {
  if (!res.startTime) return false;
  const idxStart = times.indexOf(res.startTime);
  const idxEnd = res.endTime ? times.indexOf(res.endTime) : idxStart;
  const idx = times.indexOf(time);
  return idx >= idxStart && idx <= idxEnd;
};

function ReservationTimeTable({
  selectedDate,
  events = [],
  onEdit,
  onAdd,
  staff = [],
  onDelete,
}) {
  const [detailData, setDetailData] = useState(null);
  const navigate = useNavigate();

  const handleCheckIn = async (appointment) => {
    console.log('1. 접수 시작. Appointment data:', appointment);

    if (!appointment.id || !appointment.doctorUid) {
      // doctorId -> doctorUid로 변경
      alert('예약 정보에 ID 또는 의사 ID가 없습니다. 접수할 수 없습니다.');
      console.error('접수 실패: 예약 정보 부족', appointment);
      return;
    }

    try {
      console.log('2. 서버로 보낼 데이터 준비...');
      const payload = {
        name: appointment.name,
        birth: appointment.birth,
        phone: appointment.phone,
        department: appointment.department,
        doctorUid: appointment.doctorUid, // doctorId -> doctorUid로 변경
        patientUid: appointment.patientUid, // userId -> patientUid로 변경
        title: appointment.title,
        status: '대기',
        appointmentId: appointment.id,
      };
      console.log('3. 서버로 보낼 데이터:', payload);

      await addWaitingPatient(payload);

      console.log('4. 접수 성공!');
      alert(`${appointment.name}님을 대기 목록에 추가했습니다.`);
      setDetailData(null);
    } catch (error) {
      console.error('5. 접수 실패:', error);
      const errorMsg = error.response
        ? JSON.stringify(error.response.data)
        : error.message;
      alert(`대기 환자 추가에 실패했습니다: ${errorMsg}`);
    }
  };

  const getDateStr = (date) =>
    date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          '0'
        )}-${String(date.getDate()).padStart(2, '0')}`
      : '';

  const dateStr = getDateStr(selectedDate);

  const getReservation = (doctorUid, time) => {
    // doctorId -> doctorUid로 변경
    return events.find((res) => {
      const doctorMatch = res.doctorUid === doctorUid; // res.doctorId -> res.doctorUid로 변경
      const timeMatch = isTimeInReservation(res, time);
      return doctorMatch && timeMatch;
    });
  };

  if (!selectedDate) {
    return (
      <div className="text-gray-500 mt-10 text-center">
        왼쪽 달력에서 날짜를 선택하세요.
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">
          {selectedDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </h2>
        <div className="flex gap-2">
          <button
            className="bg-gray-100 text-gray-700 rounded-md px-4 py-2 font-semibold text-sm hover:bg-gray-200"
            onClick={() => navigate('/Dashboard/reservations-list')}
          >
            예약 목록
          </button>
          <button
            className="bg-blue-600 text-white rounded-md px-4 py-2 font-semibold text-sm hover:bg-blue-700"
            onClick={() => onAdd({ date: dateStr })}
          >
            + 예약 등록
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-3 py-2 text-gray-600 font-bold w-24">
                시간
              </th>
              {staff.map((doc) => (
                <th
                  key={doc.uid}
                  className="border border-gray-200 px-3 py-2 text-gray-600 font-bold"
                >
                  {doc.name}
                  <br />
                  <span className="text-xs text-gray-500 font-normal">
                    {doc.department}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((time) => (
              <tr key={time}>
                <td className="border border-gray-200 px-3 py-2 text-center font-mono">
                  {time}
                </td>
                {staff.map((doc) => {
                  const res = getReservation(doc.uid, time); // doc.uid를 doctorUid로 전달
                  if (res) {
                    return (
                      <td
                        key={doc.uid}
                        className="border border-gray-200 p-1 align-top bg-blue-50"
                      >
                        <div
                          className="bg-blue-100 text-blue-800 rounded p-2 cursor-pointer h-full flex flex-col justify-between"
                          onClick={() => setDetailData(res)}
                        >
                          <div>
                            <p className="font-semibold">{res.name}</p>
                            <p className="text-xs text-gray-600">{res.title}</p>
                          </div>
                          <div className="text-right mt-1">
                            <button
                              className="text-blue-600 hover:underline text-xs font-semibold"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(res);
                              }}
                            >
                              수정
                            </button>
                            <button
                              className="text-blue-600 hover:underline text-xs font-semibold ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(res.id);
                              }}
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </td>
                    );
                  }
                  return (
                    <td
                      key={doc.uid}
                      className="border border-gray-200 text-center align-middle cursor-pointer hover:bg-gray-100"
                      onClick={() =>
                        onAdd({
                          date: dateStr,
                          department: doc.department,
                          doctor: doc.name,
                          doctorUid: doc.uid, // doctorId -> doctorUid로 변경
                        })
                      }
                    >
                      <span className="text-gray-400 text-xs">+</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detailData && (
        <div
          className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center"
          onClick={() => setDetailData(null)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">예약 상세 정보</h3>
            <div className="space-y-2 text-sm">
              <p>
                <b>환자명:</b> {detailData.name} ({detailData.birth})
              </p>
              <p>
                <b>연락처:</b> {detailData.phone || '-'}
              </p>
              <p>
                <b>진료과:</b> {detailData.department}
              </p>
              <p>
                <b>담당의:</b>{' '}
                {(staff.find((d) => d.uid === detailData.doctorUid) || {})
                  .name || '미지정'}
              </p>{' '}
              {/* doctorId -> doctorUid로 변경 */}
              <p>
                <b>시술:</b> {detailData.title}
              </p>
              <p>
                <b>시간:</b> {detailData.startTime} ~ {detailData.endTime}
              </p>
              <p>
                <b>메모:</b> {detailData.memo || '-'}
              </p>
            </div>
            <div className="text-right mt-4 space-x-2">
              <button
                className="bg-blue-600 text-white rounded-md px-4 py-2 font-semibold text-sm"
                onClick={() => handleCheckIn(detailData)}
              >
                접수
              </button>
              <button
                className="bg-gray-200 text-gray-800 rounded-md px-4 py-2 font-semibold text-sm"
                onClick={() => setDetailData(null)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReservationTimeTable;
