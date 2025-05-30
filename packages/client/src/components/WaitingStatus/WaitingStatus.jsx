import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// ====== 스타일 ======
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

const BG = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(180deg,#005ecb 0%,#4db3e8 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 28px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  width: 100vw;
  max-width: 1200px;
  justify-items: center;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    max-width: 95vw;
    gap: 18px;
  }
`;

const RoomBlock = styled.div`
  min-width: 300px;
  max-width: 350px;
  background: #e6f1fb;
  border-radius: 20px;
  box-shadow: 0 2px 16px rgba(0,52,148,0.13);
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
  border: 3px solid #7fbaff;
  overflow: hidden;
`;
// (아래 스타일 모두 동일, 그대로 유지)

const RoomHeader = styled.div`
  background: #2a62bc;
  color: #fff;
  text-align: center;
  font-size: 1.45rem;
  font-weight: bold;
  letter-spacing: 0.01em;
  padding: 10px 0 0 0;
  position: relative;
`;
const Director = styled.div`
  font-size: 1.1rem;
  margin-top: 4px;
  color: #fdf67c;
  font-weight: 600;
`;
const InTreatment = styled.div`
  font-size: 1.8rem;
  color: #286ac8;
  font-weight: 700;
  text-align: center;
  padding: 14px 0 6px 0;
  letter-spacing: 0.08em;
`;
const InTreatmentNo = styled.span`
  font-size: 2.7rem;
  font-weight: bold;
  color: #ff5722;
  margin-left: 10px;
`;
const WaitListWrap = styled.div`
  background: #f8fcff;
  border-radius: 0 0 18px 18px;
  padding: 5px 0 18px 0;
  min-height: 255px;
`;
const WaitRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 1.2rem;
  padding: 8px 28px;
  color: #1e356e;
  font-weight: 500;
  border-bottom: 1px dashed #b3d4fb;
`;
const WaitLabel = styled.span`
  width: 64px;
  font-weight: bold;
  color: #0d62be;
`;
const WaitName = styled.span`
  flex: 1;
  color: #16428b;
  font-size: 1.1rem;
  font-weight: 600;
`;
const WaitCountBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 1.18rem;
  background: #e3ecfc;
  color: #195aa2;
  font-weight: bold;
  border-radius: 0 0 12px 12px;
  padding: 7px 24px;
  margin-top: 8px;
`;
const ReadyTxt = styled.div`
  color: #bb2222;
  font-size: 2.1rem;
  font-weight: bold;
  text-align: center;
  padding: 48px 0 60px 0;
`;

// 오버레이 스타일
const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(255,255,255,0.96);
  z-index: 9999;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  animation: ${fadeIn} 0.3s ease;
  ${({ disappear }) => disappear && `animation: ${fadeOut} 0.4s forwards;`}
`;
const OverlayTextBig = styled.div`
  font-size: 3.4rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 30px;
  letter-spacing: 0.04em;
`;
const OverlayTextRed = styled.span`
  color: #e12a2a;
`;
const OverlayTextCenter = styled.div`
  font-size: 2.2rem;
  color: #3665d1;
  font-weight: 700;
`;

// ====== 진료실 매핑 테이블 (3개만) ======
const ROOMS = [
  { key: '1', label: '① 진료실', doctor: '남성안', department: '보철과' },
  { key: '2', label: '② 진료실', doctor: '염현정', department: '교정과' },
  { key: '3', label: '③ 진료실', doctor: '김영철', department: '치주과' }
];
const MAX_WAIT = 5;
const makeInit = () => {
  const obj = {};
  ROOMS.forEach(r => { obj[r.key] = { inTreatment: '', waiting: [], pendingClear: false }; });
  return obj;
};

function MonitoringOverlay({ visible, name, room, onDone }) {
  const [disappear, setDisappear] = useState(false);
  useEffect(() => {
    if (visible) {
      setDisappear(false);
      const timer = setTimeout(() => {
        setDisappear(true);
        setTimeout(onDone, 400);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDone]);

  if (!visible) return null;
  return (
    <Overlay disappear={disappear}>
      <OverlayTextBig>
        <OverlayTextRed>{name}</OverlayTextRed> 님
      </OverlayTextBig>
      <OverlayTextCenter>
        <OverlayTextRed>{room}</OverlayTextRed> 진료실로 오시기 바랍니다.
      </OverlayTextCenter>
    </Overlay>
  );
}

const WaitingStatus = () => {
  const [rooms, setRooms] = useState(makeInit());
  const [overlay, setOverlay] = useState({ show: false, name: '', room: '', roomKey: '' });
  const clearTimers = useRef({});
  const departmentToRoom = {
    '보철과': '1',
    '교정과': '2',
    '치주과': '3',
  };

  const moveToInTreatment = (patientName, roomKey) => {
    setRooms(prev => {
      const newRooms = { ...prev };
      newRooms[roomKey].waiting = newRooms[roomKey].waiting.filter(name => name !== patientName);
      newRooms[roomKey].inTreatment = patientName;
      newRooms[roomKey].pendingClear = false;
      return newRooms;
    });
  };

  // ✨ 진료완료 polling 직후 inTreatment를 바로 비우지 않고 1초 delay 후 비움
  const handleCompleteToReady = (roomKey) => {
    setRooms(prev => {
      if (prev[roomKey].inTreatment && !prev[roomKey].pendingClear) {
        // 아직 딜레이 안걸림
        const newRooms = { ...prev };
        newRooms[roomKey].pendingClear = true;
        // 기존 타이머 클리어
        if (clearTimers.current[roomKey]) clearTimeout(clearTimers.current[roomKey]);
        clearTimers.current[roomKey] = setTimeout(() => {
          setRooms(rNow => {
            const updated = { ...rNow };
            updated[roomKey].inTreatment = '';
            updated[roomKey].pendingClear = false;
            return updated;
          });
        }, 1000); // 1초 뒤에 비움
        return newRooms;
      } else {
        // 이미 딜레이 걸린 상태거나 진료중 환자 없음
        return prev;
      }
    });
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('http://localhost:3000/waiting/status');
        let data = await res.json();

        // "data"가 배열(구 appointments 스타일) or 객체(rooms 구조) 모두 지원
        if (Array.isArray(data)) {
          // 배열 데이터를 기존 rooms 구조로 변환
          const tempRooms = makeInit();
          data.forEach(item => {
            const roomKey = departmentToRoom[item.department];
            if (roomKey) {
              if (item.status === '진료중') {
                tempRooms[roomKey].inTreatment = item.name;
              } else {
                tempRooms[roomKey].waiting.push(item.name);
              }
            }
          });
          data = tempRooms;
        }
        setRooms(prevRooms => {
          // 기존 진료중 환자 유지
          Object.keys(prevRooms).forEach(roomKey => {
            if (!data[roomKey].inTreatment && prevRooms[roomKey].inTreatment) {
              data[roomKey].inTreatment = prevRooms[roomKey].inTreatment;
            }
          });
          return data;
        });
      } catch (err) {}
    };
    fetchRooms();
    const interval = setInterval(fetchRooms, 2000);
    const poll = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:3000/api/call');
        const data = await res.json();
        if (data && data.name && data.room) {
          const roomKey = data.room;
          setOverlay({
            show: true,
            name: data.name,
            room: ROOMS.find(r => r.key === data.room)?.label || data.room,
            roomKey,
          });
          moveToInTreatment(data.name, roomKey);
        }
      } catch (e) {}
    }, 1500);
    return () => { clearInterval(interval); clearInterval(poll); };
  }, []);

  useEffect(() => {
    const checkComplete = () => {
      ROOMS.forEach(room => {
        const curInTreat = rooms[room.key]?.inTreatment;
        if (curInTreat) {
          const stillWaiting = Object.values(rooms).some(r => r.waiting.includes(curInTreat));
          if (!stillWaiting) {
            handleCompleteToReady(room.key);
          }
        }
      });
    };
    checkComplete();
  }, [rooms]);

  const handleOverlayDone = () => setOverlay({ ...overlay, show: false });

  return (
    <BG>
      <Grid>
        {ROOMS.map(room => (
          <RoomBlock key={room.key}>
            <RoomHeader>
              {room.label}
              <Director>원장 {room.doctor}</Director>
            </RoomHeader>
            {rooms[room.key].inTreatment ? (
              <InTreatment>
                진료중 <InTreatmentNo>{rooms[room.key].inTreatment}</InTreatmentNo>
              </InTreatment>
            ) : (
              <ReadyTxt>준비중</ReadyTxt>
            )}
            <WaitListWrap>
              {Array.from({ length: MAX_WAIT }).map((_, i) => (
                <WaitRow key={i}>
                  <WaitLabel>대기{String.fromCharCode(9312 + i)}</WaitLabel>
                  <WaitName>
                    {rooms[room.key].waiting[i] ? (
                      rooms[room.key].waiting[i]
                    ) : (
                      <span style={{ color: '#adb8c6' }}>-</span>
                    )}
                  </WaitName>
                </WaitRow>
              ))}
              <WaitCountBar>
                <span>대기인수</span>
                <span>{rooms[room.key].waiting.length} 명</span>
              </WaitCountBar>
            </WaitListWrap>
          </RoomBlock>
        ))}
      </Grid>
      <MonitoringOverlay
        visible={overlay.show}
        name={overlay.name}
        room={overlay.room}
        onDone={handleOverlayDone}
      />
    </BG>
  );
};

export default WaitingStatus;