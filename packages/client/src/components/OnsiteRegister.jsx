import React, { useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';

const AppContainer = styled.div`
  background: #f9f9f9;
  padding: 40px 20px;
  min-height: 100vh;
`;

const Wrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
  background: #fff;
  padding: 48px 60px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Noto Sans KR', sans-serif;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
`;

const Description = styled.p`
  text-align: center;
  color: #777;
  margin-bottom: 40px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
  background: #fff;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
  background: #fff;
`;

const Select = styled.select`
  width: 100%;
  padding: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
  background: #fff;
`;

const TwoColumnRow = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

const HalfWidth = styled.div`
  flex: 1;
  min-width: 300px;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin: 40px 0 16px;
  text-align: center;
`;

const Button = styled.button`
  width: 100%;
  padding: 16px 0;
  background: #5f0080;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  margin-top: 20px;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: #3e005b;
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #999;
  margin-top: 24px;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;

  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: center;
  }

  th {
    background: #f5f5f5;
  }
`;

const OnsiteRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    birth: '',
    gender: '',
    phone: '',
    address: '',
    insuranceNumber: '',
    firstVisitDate: '',
    lastVisitDate: '',
    allergies: '',
    medications: '',
    memo: ''
  });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      birth: formData.birth,
      gender: formData.gender,
      phone: formData.phone,
      address: formData.address,
      insuranceNumber: formData.insuranceNumber || '',
      firstVisitDate: formData.firstVisitDate || '',
      lastVisitDate: formData.lastVisitDate || '',
      allergies: formData.allergies || '',
      medications: formData.medications || '',
      memo: formData.memo || ''
    };

    console.log('제출 payload:', payload);

    try {
      const res = await axios.post('http://localhost:3000/api/onsite', payload);
      alert('접수 완료');
      setPatients(prev => [...prev, payload]);
      setFormData({
        name: '',
        birth: '',
        gender: '',
        phone: '',
        address: '',
        insuranceNumber: '',
        firstVisitDate: '',
        lastVisitDate: '',
        allergies: '',
        medications: '',
        memo: ''
      });
    } catch (err) {
      console.error(err);
      alert('접수 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer>
      <Wrapper>
        <Title>현장 접수</Title>
        <Description>기본 정보를 입력해 주세요.</Description>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>이름 *</Label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>생년월일 *</Label>
            <Input type="date" name="birth" value={formData.birth} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>성별 *</Label>
            <Select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">선택</option>
              <option value="남">남</option>
              <option value="여">여</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>전화번호 *</Label>
            <Input name="phone" value={formData.phone} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>주소</Label>
            <Input name="address" value={formData.address} onChange={handleChange} />
          </FormGroup>

          <SectionTitle>진료 관련 정보</SectionTitle>
          <FormGroup>
            <Label>의료보험 번호</Label>
            <Input name="insuranceNumber" value={formData.insuranceNumber} onChange={handleChange} />
          </FormGroup>

          <TwoColumnRow>
            <HalfWidth>
              <Label>첫 내원일</Label>
              <Input type="date" name="firstVisitDate" value={formData.firstVisitDate} onChange={handleChange} />
            </HalfWidth>
            <HalfWidth>
              <Label>마지막 내원일</Label>
              <Input type="date" name="lastVisitDate" value={formData.lastVisitDate} onChange={handleChange} />
            </HalfWidth>
          </TwoColumnRow>

          <FormGroup>
            <Label>알레르기</Label>
            <Textarea name="allergies" value={formData.allergies} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label>복용 중인 약</Label>
            <Textarea name="medications" value={formData.medications} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label>메모</Label>
            <Textarea name="memo" value={formData.memo} onChange={handleChange} />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? '접수 중...' : '접수'}
          </Button>
        </form>

        <SectionTitle>접수 목록</SectionTitle>
        {!Array.isArray(patients) || patients.length === 0 ? (
          <EmptyMessage>접수된 환자가 아직 없습니다.</EmptyMessage>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>이름</th>
                <th>전화번호</th>
                <th>생년월일</th>
                <th>성별</th>
                <th>주소</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => (
                <tr key={i}>
                  <td>{p?.name || '-'}</td>
                  <td>{p?.phone || '-'}</td>
                  <td>{p?.birth || '-'}</td>
                  <td>{p?.gender || '-'}</td>
                  <td>{p?.address || '-'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Wrapper>
    </AppContainer>
  );
};

export default OnsiteRegister;
