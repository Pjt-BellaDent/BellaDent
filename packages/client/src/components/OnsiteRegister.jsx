import React, { useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';

const Container = styled.div`
  max-width: 900px;
  margin: 40px auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 40px;
`;

const TitleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #444;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 15px;
  background: #fafafa;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 15px;
  background: #fafafa;
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
`;

const Table = styled.table`
  width: 100%;
  margin-top: 40px;
  border-collapse: collapse;
  font-size: 15px;
`;

const Th = styled.th`
  padding: 14px;
  background: #f4f6fa;
  text-align: left;
  border-bottom: 2px solid #ddd;
  color: #333;
`;

const Td = styled.td`
  padding: 14px;
  border-bottom: 1px solid #eee;
  color: #555;
`;

const EmptyMsg = styled.p`
  margin-top: 40px;
  text-align: center;
  color: #888;
`;

const OnsiteRegistration = () => {
  const [form, setForm] = useState({
    name: '',
    birth: '',
    gender: '',
    phone: '',
    address: ''
  });

  const [patients, setPatients] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.birth || !form.gender || !form.phone) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/onsite/register', form);
      console.log('서버 응답:', res.data);
    } catch (err) {
      console.error('서버 오류:', err);
    }

    setPatients(prev => [...prev, form]);
    setForm({ name: '', birth: '', gender: '', phone: '', address: '' });
  };

  return (
    <Container>
      <TitleBox>
        <Title>현장 접수</Title>
      </TitleBox>
      <form onSubmit={handleSubmit}>
        <FormRow>
          <FormGroup>
            <Label>이름</Label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>생년월일</Label>
            <Input type="date" name="birth" value={form.birth} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>성별</Label>
            <Select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">선택</option>
              <option value="남">남</option>
              <option value="여">여</option>
            </Select>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup>
            <Label>전화번호</Label>
            <Input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
          </FormGroup>
          <FormGroup style={{ flex: 2 }}>
            <Label>주소</Label>
            <Input name="address" value={form.address} onChange={handleChange} />
          </FormGroup>
        </FormRow>
        <Button type="submit">접수</Button>
      </form>

      {patients.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>이름</Th>
              <Th>생년월일</Th>
              <Th>성별</Th>
              <Th>전화번호</Th>
              <Th>주소</Th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p, idx) => (
              <tr key={idx}>
                <Td>{p.name}</Td>
                <Td>{p.birth}</Td>
                <Td>{p.gender}</Td>
                <Td>{p.phone}</Td>
                <Td>{p.address}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyMsg>접수된 환자가 아직 없습니다.</EmptyMsg>
      )}
    </Container>
  );
};

export default OnsiteRegistration;
