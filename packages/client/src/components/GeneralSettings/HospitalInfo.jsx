import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useHospitalInfo } from '../../contexts/HospitalContext';

const Container = styled.div`
  display: flex;
  gap: 30px;
  padding: 30px;
`;

const InfoBox = styled.div`
  flex: 1;
  background: white;
  padding: 24px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
`;

const EditPanel = styled.div`
  width: 320px;
  background: #f7f9fc;
  padding: 24px;
  border-radius: 10px;
  border: 1px solid #ddd;
`;

const Group = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 6px;
`;

const Text = styled.div`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fafafa;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
`;

const Button = styled.button`
  margin-top: 10px;
  margin-right: 10px;
  padding: 10px 18px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:hover { background: #0056b3; }
`;

const CancelButton = styled(Button)`
  background: #999;
  &:hover { background: #666; }
`;

const HospitalInfo = () => {
  const { hospitalInfo, setHospitalInfo } = useHospitalInfo();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...hospitalInfo });

  const handleSave = () => {
    setHospitalInfo(form);
    localStorage.setItem('hospitalInfo', JSON.stringify(form));
    setEditMode(false);
    alert('병원 정보가 수정되었습니다.');
  };

  return (
    <Container>
      <InfoBox>
        <h3>🏥 병원 정보</h3>
        {Object.entries({
          name: '병원명',
          address: '주소',
          ceo: '대표자명',
          bizNumber: '사업자등록번호',
          phone: '연락처'
        }).map(([key, label]) => (
          <Group key={key}>
            <Label>{label}</Label>
            <Text>{hospitalInfo[key]}</Text>
          </Group>
        ))}
        <Button onClick={() => setEditMode(true)}>수정</Button>
      </InfoBox>

      {editMode && (
        <EditPanel>
          <h4>병원 정보 수정</h4>
          {Object.entries({
            name: '병원명',
            address: '주소',
            ceo: '대표자명',
            bizNumber: '사업자등록번호',
            phone: '연락처'
          }).map(([key, label]) => (
            <Group key={key}>
              <Label>{label}</Label>
              <Input
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
              />
            </Group>
          ))}
          <Button onClick={handleSave}>저장</Button>
          <CancelButton onClick={() => setEditMode(false)}>취소</CancelButton>
        </EditPanel>
      )}
    </Container>
  );
};

export default HospitalInfo;
