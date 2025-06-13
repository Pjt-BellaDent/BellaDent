import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useHospitalInfo } from '../../contexts/HospitalContext';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`padding: 30px;`;
const Section = styled.div`
  background: white;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
`;
const Group = styled.div`margin-bottom: 15px;`;
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
  margin-right: 10px;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:hover { background: #0056b3; }
`;

const GeneralSettings = () => {
  const { hospitalInfo, setHospitalInfo } = useHospitalInfo();
  const [editMode, setEditMode] = useState(false);
  const [hospital, setHospital] = useState({ ...hospitalInfo });

  const [system, setSystem] = useState({ notify: 'ON', interval: 15, emr: '사용' });
  const navigate = useNavigate();

  const saveHospitalInfo = () => {
    setHospitalInfo({ ...hospital }); // 전역 상태 업데이트
    localStorage.setItem('hospitalInfo', JSON.stringify(hospital)); // 로컬 저장
    setEditMode(false);
    alert('병원 정보가 저장되었습니다.');
  };

  const cancelEdit = () => {
    setHospital({ ...hospitalInfo });
    setEditMode(false);
  };

  return (
    <Container>
      <h2>⚙️ 전체 설정</h2>

      <Section>
        <Button onClick={() => navigate('/Dashboard/hospital-info')}>
          병원 정보 관리
        </Button>
      </Section>

      <Section>
        <Button onClick={() => navigate('/Dashboard/user-permissions')}>사용자 권한 관리</Button>
      </Section>

      <Section>
        <h3>🔧 시스템 설정</h3>
        <Group>
          <Label>알림 수신</Label>
          <Select value={system.notify} onChange={e => setSystem({ ...system, notify: e.target.value })}>
            <option>ON</option>
            <option>OFF</option>
          </Select>
        </Group>
        <Group>
          <Label>진료 예약 간격 (분)</Label>
          <Input type="number" value={system.interval} onChange={e => setSystem({ ...system, interval: e.target.value })} />
        </Group>
        <Group>
          <Label>EMR 연동</Label>
          <Select value={system.emr} onChange={e => setSystem({ ...system, emr: e.target.value })}>
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
