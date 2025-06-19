import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

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

const OnsiteRegister = () => {
  const [form, setForm] = useState({
    email: '', password: '', name: '', birth: '', gender: '', phone: '', address: '',
    insuranceNumber: '', firstVisitDate: '', lastVisitDate: '', allergies: '', medications: '', memo: ''
  });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const fetchPatients = async () => {
    try {
      const token = await getAuth().currentUser.getIdToken();
      const res = await axios.get("http://localhost:3000/users/patient", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sorted = res.data.patientsInfo.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setPatients(sorted);
    } catch (err) {
      console.error("접수 리스트 불러오기 실패:", err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getAuth().currentUser.getIdToken();

      const payload = {
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone,
        birth: form.birth, // 문자열로 전송
        gender: form.gender, // "M" 또는 "F"
        address: form.address,
        role: "patient",
        patientInfo: {
          insuranceNumber: form.insuranceNumber,
          allergies: form.allergies,
          medications: form.medications,
          memo: form.memo,
          firstVisitDate: form.firstVisitDate, // 문자열로 전송
          lastVisitDate: form.lastVisitDate
        }
      };

      console.log("제출 데이터:", payload);

      await axios.post("http://localhost:3000/users/patient", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("접수가 완료되었습니다.");
      fetchPatients();
      setForm({
        email: '', password: '', name: '', birth: '', gender: '', phone: '', address: '',
        insuranceNumber: '', firstVisitDate: '', lastVisitDate: '', allergies: '', medications: '', memo: ''
      });
    } catch (err) {
      console.error("접수 중 오류:", err.response?.data || err.message);
      alert(err.response?.data?.message || "서버 오류로 접수에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <AppContainer>
      <Wrapper>
        <Title>현장 접수</Title>
        <Description>기본 정보를 입력해 주세요. <span style={{ color: '#dc3545' }}>*</span> 표시는 필수 항목입니다.</Description>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>이메일 *</Label>
            <Input name="email" value={form.email} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>비밀번호 *</Label>
            <Input type="password" name="password" value={form.password} onChange={handleChange} required />
          </FormGroup>

          <TwoColumnRow>
            <HalfWidth>
              <Label>이름 *</Label>
              <Input name="name" value={form.name} onChange={handleChange} required />
            </HalfWidth>
            <HalfWidth>
              <Label>생년월일 *</Label>
              <Input type="date" name="birth" value={form.birth} onChange={handleChange} required />
            </HalfWidth>
          </TwoColumnRow>

          <TwoColumnRow>
            <HalfWidth>
              <Label>성별 *</Label>
              <Select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">선택</option>
                <option value="M">남</option>
                <option value="F">여</option>
              </Select>
            </HalfWidth>
            <HalfWidth>
              <Label>전화번호 *</Label>
              <Input name="phone" value={form.phone} onChange={handleChange} required />
            </HalfWidth>
          </TwoColumnRow>

          <FormGroup>
            <Label>주소</Label>
            <Input name="address" value={form.address} onChange={handleChange} />
          </FormGroup>

          <SectionTitle>진료 관련 정보</SectionTitle>

          <FormGroup>
            <Label>의료보험 번호</Label>
            <Input name="insuranceNumber" value={form.insuranceNumber} onChange={handleChange} />
          </FormGroup>

          <TwoColumnRow>
            <HalfWidth>
              <Label>첫 내원일</Label>
              <Input type="date" name="firstVisitDate" value={form.firstVisitDate} onChange={handleChange} />
            </HalfWidth>
            <HalfWidth>
              <Label>마지막 내원일</Label>
              <Input type="date" name="lastVisitDate" value={form.lastVisitDate} onChange={handleChange} />
            </HalfWidth>
          </TwoColumnRow>

          <FormGroup>
            <Label>알레르기</Label>
            <Textarea name="allergies" value={form.allergies} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label>복용 중인 약</Label>
            <Textarea name="medications" value={form.medications} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label>메모</Label>
            <Textarea name="memo" value={form.memo} onChange={handleChange} />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? '접수 중...' : '접수'}
          </Button>
        </form>

        <SectionTitle>접수 목록</SectionTitle>

        {patients.length === 0 ? (
          <EmptyMessage>접수된 환자가 아직 없습니다.</EmptyMessage>
        ) : (
          <ul style={{ marginTop: '20px', listStyle: 'none', padding: 0, textAlign: 'center' }}>
            {patients.map((p, idx) => (
              <li key={idx} style={{ marginBottom: '10px', fontSize: '16px' }}>
                {p.name} ({p.birth})
              </li>
            ))}
          </ul>
        )}
      </Wrapper>
    </AppContainer>
  );
};

export default OnsiteRegister;