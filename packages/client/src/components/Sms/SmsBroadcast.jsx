import React, { useState } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 30px;
  background-color: #f8f9fc;
  font-family: 'Noto Sans KR', sans-serif;
  position: relative;
  min-height: 100vh;
  padding-bottom: 120px;
`;

const Title = styled.h2`
  font-size: 22px;
  margin-bottom: 20px;
  color: #333;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
`;

const Th = styled.th`
  background-color: #6699CC;
  color: white;
  padding: 12px;
  font-size: 14px;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: ${({ color }) => color || '#AAAAAA'};
  color: white;
  border: none;
  border-radius: 5px;
  margin-bottom: 4px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: ${({ color }) => color === '#dc3545' ? '#c82333' : '#0056b3'};
  }
`;

const FixedInputBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #f8f9fc;
  padding: 16px 30px;
  border-top: 1px solid #ccc;
  display: flex;
  gap: 10px;
`;

const AutoTextarea = styled.textarea`
  flex: 1;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 12px 18px;
  resize: none;
  overflow: hidden;
  line-height: 1.4;
  max-height: 120px;
`;

const SendButton = styled.button`
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #0056b3;
  }
`;

const patientsMock = [
  { id: 1, name: '홍길동', phone: '010-1234-5678' },
  { id: 2, name: '김하나', phone: '010-5678-1234' },
  { id: 3, name: '이몽룡', phone: '010-2345-6789' },
];

const SmsBroadcast = () => {
  const [patients, setPatients] = useState(patientsMock);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState('');

  const toggleSelect = (id) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((v) => v !== id)
        : [...selected, id]
    );
  };

  const toggleAll = () => {
    setSelected(selected.length === patients.length ? [] : patients.map(p => p.id));
  };

  const sendSms = () => {
    if (!message.trim()) return alert('메시지를 입력하세요.');
    if (selected.length === 0) return alert('수신 대상을 선택하세요.');
    alert(`총 ${selected.length}명에게 문자 발송 완료.`);
    setMessage('');
  };

  const handleChange = (e) => {
    const el = e.target;
    setMessage(el.value.slice(0, 200)); // 최대 200자 제한
    el.style.height = 'auto'; // 초기화
    el.style.height = el.scrollHeight + 'px'; // 현재 내용만큼 높이 조정
  };

  return (
    <Container>
      <Title>📱 단체 문자 발송</Title>

      <FilterRow>
        <Select>
          <option>진료일자 선택</option>
          <option>오늘</option>
          <option>이번주</option>
          <option>이번달</option>
        </Select>
        <Select>
          <option>진료과 선택</option>
          <option>치과</option>
          <option>소아과</option>
          <option>내과</option>
        </Select>
        <Select>
          <option>문자 유형</option>
          <option>진료 안내</option>
          <option>예약 알림</option>
          <option>프로모션</option>
        </Select>
      </FilterRow>

      <Button onClick={toggleAll}>전체 선택</Button>

      <Table>
        <thead>
          <tr>
            <Th>선택</Th>
            <Th>이름</Th>
            <Th>전화번호</Th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <Td>
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => toggleSelect(p.id)}
                />
              </Td>
              <Td>{p.name}</Td>
              <Td>{p.phone}</Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <FixedInputBar>
        <AutoTextarea
          placeholder="답변을 입력하세요..."
          value={message}
          onChange={handleChange}
          rows={1}
        />
        <SendButton onClick={sendSms}>전송</SendButton>
      </FixedInputBar>
    </Container>
  );
};

export default SmsBroadcast;
