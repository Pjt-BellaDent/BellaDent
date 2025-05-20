import React, { useState } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 30px;
`;

const Section = styled.div`
  background: white;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
`;

const Group = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

const GeneralSettings = () => {
  const [hospital, setHospital] = useState({
    name: '서울 메디컬센터',
    address: '서울특별시 중구 명동로 1',
    phone: '02-1234-5678',
  });

  const [user, setUser] = useState({
    role: '의사',
    name: '',
    email: '',
  });

  const [system, setSystem] = useState({
    notify: 'ON',
    interval: 15,
    emr: '사용',
  });

  return (
    <Container>
      <h2>⚙️ 전체 설정</h2>

      <Section>
        <h3>🏥 병원 정보</h3>
        <Group>
          <Label>병원명</Label>
          <Input
            value={hospital.name}
            onChange={e => setHospital({ ...hospital, name: e.target.value })}
          />
        </Group>
        <Group>
          <Label>주소</Label>
          <Input
            value={hospital.address}
            onChange={e => setHospital({ ...hospital, address: e.target.value })}
          />
        </Group>
        <Group>
          <Label>연락처</Label>
          <Input
            value={hospital.phone}
            onChange={e => setHospital({ ...hospital, phone: e.target.value })}
          />
        </Group>
        <Button>저장</Button>
      </Section>

      <Section>
        <h3>👤 사용자 권한 관리</h3>
        <Group>
          <Label>역할 선택</Label>
          <Select
            value={user.role}
            onChange={e => setUser({ ...user, role: e.target.value })}
          >
            <option>의사</option>
            <option>간호사</option>
            <option>행정팀</option>
          </Select>
        </Group>
        <Group>
          <Label>이름</Label>
          <Input
            placeholder="예: 홍길동"
            value={user.name}
            onChange={e => setUser({ ...user, name: e.target.value })}
          />
        </Group>
        <Group>
          <Label>이메일</Label>
          <Input
            type="email"
            placeholder="예: user@hospital.com"
            value={user.email}
            onChange={e => setUser({ ...user, email: e.target.value })}
          />
        </Group>
        <Button>사용자 추가</Button>
      </Section>

      <Section>
        <h3>🔧 시스템 설정</h3>
        <Group>
          <Label>알림 수신</Label>
          <Select
            value={system.notify}
            onChange={e => setSystem({ ...system, notify: e.target.value })}
          >
            <option>ON</option>
            <option>OFF</option>
          </Select>
        </Group>
        <Group>
          <Label>진료 예약 간격 (분)</Label>
          <Input
            type="number"
            value={system.interval}
            onChange={e => setSystem({ ...system, interval: e.target.value })}
          />
        </Group>
        <Group>
          <Label>EMR 연동</Label>
          <Select
            value={system.emr}
            onChange={e => setSystem({ ...system, emr: e.target.value })}
          >
            <option>사용</option>
            <option>미사용</option>
          </Select>
        </Group>
        <Button>시스템 설정 저장</Button>
      </Section>
    </Container>
  );
};

export default GeneralSettings;
