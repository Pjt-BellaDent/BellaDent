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
      }, 2000);
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
  const lastOverlayRef = useRef({ name: '', roomKey: '', ts: 0 });
  const clearTimers = useRef({});
  const departmentToRoom = {
    '보철과': '1',
    '교정과': '2',
    '치주과': '3',
  };

  useEffect(() => {
    let lastDataStr = JSON.stringify(makeInit());
    const fetchRooms = async () => {
      try {
        const res = await fetch('http://localhost:3000/waiting/status');
        let data = await res.json();
        if (Array.isArray(data)) {
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
        const dataStr = JSON.stringify(data);
        // 기존 rooms와 완전히 같으면 setRooms 하지 않음 (불필요한 초기화 방지)
        if (dataStr !== lastDataStr) {
          setRooms(data);
          lastDataStr = dataStr;
        }
      } catch (e) {}
    };
    fetchRooms();
    const interval = setInterval(fetchRooms, 2000);

    // 오버레이 polling (기존 구조 유지)
    const poll = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:3000/api/call');
        const data = await res.json();
        const now = Date.now();
        if (
          data && data.name && data.room &&
          !(overlay.show && overlay.name === data.name && overlay.roomKey === data.room) &&
          (!lastOverlayRef.current.name ||
            lastOverlayRef.current.name !== data.name ||
            lastOverlayRef.current.roomKey !== data.room ||
            now - lastOverlayRef.current.ts > 1800)
        ) {
          lastOverlayRef.current = { name: data.name, roomKey: data.room, ts: now };
          setOverlay({
            show: true,
            name: data.name,
            room: ROOMS.find(r => r.key === data.room)?.label || data.room,
            roomKey: data.room,
          });
        }
      } catch {}
    }, 1500);
    return () => { clearInterval(interval); clearInterval(poll); };
  }, []);

  useEffect(() => {
    console.log(
      '[프론트][inTreatment]',
      Object.entries(rooms)
        .map(([k, v]) => `방${k}: 진료중:${v.inTreatment} 대기:[${v.waiting.join(',')}]`)
        .join(' | ')
    );
    // ...handleCompleteToReady 생략...
  }, [rooms]);

  // ...진료완료 polling 딜레이, 렌더링, 오버레이 등 기존 코드 그대로...

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
        onDone={() => setOverlay({ ...overlay, show: false })}
      />
    </BG>
  );
};

export default WaitingStatus;
