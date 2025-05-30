import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 30px;
  background-color: #f8f9fc;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Title = styled.h2`
  font-size: 22px;
  margin-bottom: 20px;
  color: #333;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: ${({ color }) => color || '#007bff'};
  color: white;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: ${({ color }) =>
      color === '#dc3545' ? '#c82333' : '#0056b3'};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 10px;
`;

const Th = styled.th`
  background-color: #6699cc;
  color: white;
  padding: 12px;
  font-size: 14px;
  text-align: center;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
`;

const MessageInput = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
  margin-bottom: 20px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 20px;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  background-color: ${({ active }) => (active ? '#007bff' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;

const SearchInput = styled.input`
  padding: 8px;
  font-size: 14px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
`;

const DateInput = styled.input`
  padding: 8px;
  font-size: 14px;
  margin-left: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const patientsMock = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  name: `환자${i + 1}`,
  phone: `010-${String(1000 + i).slice(0, 4)}-${String(5678 + i).slice(0, 4)}`
}));

const getKoreanDay = (dateStr) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const date = new Date(dateStr);
  return days[date.getDay()];
};

const SmsBroadcast = () => {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [revisitDate, setRevisitDate] = useState('');

  const pageSize = 10;

  useEffect(() => {
    setPatients(patientsMock);
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.name.includes(searchTerm.trim()) || p.phone.includes(searchTerm.trim())
  );

  const totalPages = Math.ceil(filteredPatients.length / pageSize);

  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const currentIds = paginatedPatients.map((p) => p.id);
    const allSelected = currentIds.every((id) => selected.includes(id));

    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...currentIds])]);
    }
  };

  const sendSms = () => {
    if (!message.trim()) return alert('메시지를 입력하세요.');
    if (selected.length === 0) return alert('수신 대상을 선택하세요.');
    alert(`총 ${selected.length}명에게 문자 발송 완료.\n내용: ${message}`);
    setMessage('');
  };

  const insertAd = () => {
    setMessage('(광고) 안녕하세요 BellaDent 치과입니다!');
  };

  const insertRevisit = () => {
    if (!revisitDate) return alert('재진 날짜를 선택하세요.');
    if (selected.length === 0) return alert('환자를 선택하세요.');

    const day = getKoreanDay(revisitDate);
    const names = patients
      .filter((p) => selected.includes(p.id))
      .map((p) => p.name)
      .join(', ');

    const content = `안녕하세요! BellaDent 치과입니다!\n${revisitDate} (${day})은 ${names}님의 재진일입니다!`;
    setMessage(content);
  };

  const renderPageButtons = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PageButton
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </PageButton>
      );
    }
    return (
      <>
        {pages}
        {currentPage < totalPages && (
          <PageButton onClick={() => setCurrentPage(currentPage + 1)}>
            다음
          </PageButton>
        )}
      </>
    );
  };

  return (
    <Container>
      <Title>📱 단체 문자 발송</Title>

      <div style={{ marginBottom: '20px' }}>
        <Button onClick={insertAd}>📢 광고 보내기</Button>
        <Button onClick={toggleAll} color="#6c757d">전체 선택</Button>
        <Button onClick={insertRevisit} color="#17a2b8">재진 안내</Button>
        <DateInput
          type="date"
          value={revisitDate}
          onChange={(e) => setRevisitDate(e.target.value)}
        />
      </div>

      <SearchInput
        type="text"
        placeholder="이름 또는 전화번호 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table>
        <thead>
          <tr>
            <Th>선택</Th>
            <Th>이름</Th>
            <Th>전화번호</Th>
          </tr>
        </thead>
        <tbody>
          {paginatedPatients.map((p) => (
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

      <Pagination>{renderPageButtons()}</Pagination>

      <MessageInput
        placeholder="메시지를 입력하세요 (최대 80자)"
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, 80))}
      />

      <div>
        <Button onClick={sendSms}>발송</Button>
        <Button color="#dc3545" onClick={() => setMessage('')}>초기화</Button>
      </div>
    </Container>
  );
};

export default SmsBroadcast;
