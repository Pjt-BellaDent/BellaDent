import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useHospitalInfo } from '../contexts/HospitalContext';

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
const Text = styled.div`
  padding: 8px 10px;
  background: #f9f9f9;
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
const CancelButton = styled(Button)`
  background: #ccc;
  &:hover { background: #999; }
`;

const RoleDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 6px;
`;

const roleInfo = {
  super_admin: '모든 메뉴에 접근할 수 있는 최고 관리자입니다.',
  doctor: '의료진 중심 메뉴(대시보드, 대기현황, 일정, 환자)에 접근할 수 있습니다.',
  manager: '공지사항 등 일부 운영 메뉴에만 접근 가능합니다.',
  consultant: '상담/예약 관련 메뉴(예약 관리, 상담 기록)에 접근할 수 있습니다.',
  hygienist: '향후 위생사 전용 권한 추가 예정입니다.',
  receptionist: '향후 수납/접수 담당자 전용 권한 추가 예정입니다.',
};

const GeneralSettings = () => {
  const { hospitalInfo, setHospitalInfo } = useHospitalInfo();
  const [editMode, setEditMode] = useState(false);
  const [hospital, setHospital] = useState({ ...hospitalInfo });

  const [user, setUser] = useState({ role: 'doctor', name: '', email: '' });
  const [system, setSystem] = useState({ notify: 'ON', interval: 15, emr: '사용' });

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
        <h3>🏥 병원 정보</h3>
        {['name', 'address', 'ceo', 'bizNumber', 'phone'].map((field, idx) => (
          <Group key={idx}>
            <Label>
              {{
                name: '병원명',
                address: '주소',
                ceo: '대표자명',
                bizNumber: '사업자등록번호',
                phone: '연락처'
              }[field]}
            </Label>
            {editMode ? (
              <Input
                value={hospital[field]}
                onChange={e => setHospital({ ...hospital, [field]: e.target.value })}
              />
            ) : (
              <Text>{hospitalInfo[field]}</Text>
            )}
          </Group>
        ))}
        {!editMode ? (
          <Button onClick={() => setEditMode(true)}>수정</Button>
        ) : (
          <>
            <Button onClick={saveHospitalInfo}>저장</Button>
            <CancelButton onClick={cancelEdit}>취소</CancelButton>
          </>
        )}
      </Section>

      <Section>
        <h3>👤 사용자 권한 관리</h3>
        <Group>
          <Label>역할 선택</Label>
          <Select value={user.role} onChange={e => setUser({ ...user, role: e.target.value })}>
            <option value="super_admin">대표원장 (super_admin)</option>
            <option value="doctor">의사 (doctor)</option>
            <option value="manager">실장 (manager)</option>
            <option value="consultant">상담사 (consultant)</option>
            <option value="hygienist">위생사 (hygienist)</option>
            <option value="receptionist">수납/접수 (receptionist)</option>
          </Select>
          <RoleDescription>{roleInfo[user.role]}</RoleDescription>
        </Group>
        <Group>
          <Label>이름</Label>
          <Input value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} />
        </Group>
        <Group>
          <Label>이메일</Label>
          <Input type="email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} />
        </Group>
        <Button>사용자 추가</Button>
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
