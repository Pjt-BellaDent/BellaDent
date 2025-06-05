import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// ====== 스타일 (생략: 기존과 동일) ======
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

const WaitingStatus = () => {
  const [rooms, setRooms] = useState(makeInit());
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('http://localhost:3000/waiting/status');
        let data = await res.json();
        if (!Array.isArray(data) && typeof data === 'object') {
          setRooms(data);
        }
      } catch (e) {}
    };
    fetchRooms();
    const interval = setInterval(fetchRooms, 2000);
    return () => { clearInterval(interval); };
  }, []);

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
                진료중 <InTreatmentNo>
                  {rooms[room.key].inTreatment.name}
                </InTreatmentNo>
              </InTreatment>
            ) : (
              <ReadyTxt>준비중</ReadyTxt>
            )}
            <WaitListWrap>
              {Array.from({ length: MAX_WAIT }).map((_, i) => {
                const patient = rooms[room.key].waiting[i]; // { name, birth }
                return (
                  <WaitRow key={i}>
                    <WaitLabel>대기{String.fromCharCode(9312 + i)}</WaitLabel>
                    <WaitName>
                      {patient ? (
                        <>{patient.name}</>
                      ) : (
                        <span style={{ color: '#adb8c6' }}>-</span>
                      )}
                    </WaitName>
                  </WaitRow>
                );
              })}
              <WaitCountBar>
                <span>대기인수</span>
                <span>{rooms[room.key].waiting.length} 명</span>
              </WaitCountBar>
            </WaitListWrap>
          </RoomBlock>
        ))}
      </Grid>
    </BG>
  );
};

export default WaitingStatus;
