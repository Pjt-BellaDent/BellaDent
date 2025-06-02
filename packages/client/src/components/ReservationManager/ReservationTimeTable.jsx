import React, { useState } from 'react';
import styled from '@emotion/styled';

const departments = ['보철과', '교정과', '치주과'];
const times = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  th, td { 
    border: 1px solid #e8e8e8; 
    padding: 9px; 
    font-size: 15px; 
    text-align: center;
    word-break: break-all;
    max-width: 180px;
    min-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  th { background: #f7fafd; color: #2071e5; font-weight: bold; }
`;
const AddBtn = styled.button`
  background: #2071e5; color: #fff; border: none; border-radius: 7px; font-size: 15px;
  padding: 8px 18px; font-weight: 600; cursor: pointer;
`;
const RowFlex = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 14px;
  span.name {
    font-weight: 600;
    color: #2071e5;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const EditBtn = styled.button`
  background: #ffd542; border: none; color: #444; border-radius: 6px;
  font-size: 13px; padding: 2px 10px; font-weight: 600; cursor: pointer;
`;
const DelBtn = styled.button`
  background: #f36c65; border: none; color: #fff; border-radius: 6px;
  font-size: 13px; padding: 2px 10px; font-weight: 600; cursor: pointer;
`;

function ReservationTimeTable({ date, events = {}, onEdit, onDelete, onAdd }) {
  const [detailData, setDetailData] = useState(null);

  if (!date) return <div style={{color:'#888',marginTop:40}}>왼쪽 달력에서 날짜를 선택하세요.</div>;
  const dayEvents = events[date] || [];

  // 구간, 복수, 단일 모두 지원
  const isTimeInReservation = (res, time) => {
    if (!res.time) return false;
    if (res.time.includes('~')) {
      // 구간 (ex: 14:00~15:00)
      const [start, end] = res.time.split('~');
      const idxStart = times.indexOf(start);
      const idxEnd = times.indexOf(end);
      const idx = times.indexOf(time);
      return idx >= idxStart && idx <= idxEnd;
    } else if (res.time.includes(',')) {
      // 비연속 복수시간 (ex: 14:00,16:00)
      return res.time.split(',').includes(time);
    } else {
      // 단일
      return res.time === time;
    }
  };

  const getReservation = (dept, time) =>
    dayEvents.find(res => res.department === dept && isTimeInReservation(res, time));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 15 }}>
        <button
          style={{
            background: "#f2f4f8",
            color: "#2071e5",
            border: "none",
            borderRadius: 7,
            fontSize: 15,
            padding: "8px 18px",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => window.location.href = "/Dashboard/reservations/list"}
        >
          예약 목록
        </button>
        <AddBtn onClick={() => onAdd()}>+ 예약 등록</AddBtn>
      </div>
      <Table>
        <thead>
          <tr>
            <th>시간</th>
            {departments.map(dept => (
              <th key={dept}>{dept}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map(time => (
            <tr key={time}>
              <td>{time}</td>
              {departments.map(dept => {
                const res = getReservation(dept, time);
                return (
                  <td key={dept}>
                    {res ? (
                      <RowFlex>
                        <span
                          style={{ fontWeight: "bold", textDecoration: "underline", color: "#2071e5", cursor: "pointer" }}
                          onClick={() => setDetailData(res)}
                        >
                          {res.name}
                        </span>
                        <span>({res.status})</span>
                        <EditBtn onClick={() => onEdit(res)}>수정</EditBtn>
                        <DelBtn onClick={() => onDelete(res.id)}>삭제</DelBtn>
                      </RowFlex>
                    ) : (
                      <span
                      style={{color:'#aaa',fontSize:13, cursor: "pointer", textDecoration: "underline"}}
                      onClick={() => onAdd({ department: dept, time })}
                      title="이 시간에 예약 등록"
                    >
                      예약 없음
                    </span>                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
      {detailData && (
        <ReservationDetailModal data={detailData} onClose={() => setDetailData(null)} />
      )}
    </>
  );
}

// 상세 정보 모달 (간단버전)
function ReservationDetailModal({ data, onClose }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.36)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", borderRadius: 12, padding: 30, minWidth: 340, maxWidth: 420
      }}>
        <h3 style={{marginTop:0,marginBottom:14}}>환자 상세 정보</h3>
        <div style={{marginBottom:8}}><b>이름</b>: {data.name}</div>
        <div style={{marginBottom:8}}><b>생년월일</b>: {data.birth || '-'}</div>
        <div style={{marginBottom:8}}><b>연락처</b>: {data.phone || '-'}</div>
        <div style={{marginBottom:8}}><b>성별</b>: {data.gender || '-'}</div>
        <div style={{marginBottom:8}}><b>진료과</b>: {data.department}</div>
        <div style={{marginBottom:8}}><b>예약일</b>: {data.reservationDate} {data.time}</div>
        <div style={{marginBottom:8}}><b>상태</b>: {data.status}</div>
        <div style={{marginBottom:8}}><b>메모</b>: {data.memo || '-'}</div>
        <button onClick={onClose} style={{
          background: "#2071e5", color: "#fff", border: "none", borderRadius: 7, fontSize: 14, padding: "8px 24px", fontWeight: 600, marginTop: 14
        }}>닫기</button>
      </div>
    </div>
  );
}

export default ReservationTimeTable;
