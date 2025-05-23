import React, { useState } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 30px;
  background-color: #f4f7fc;
  min-height: 100vh;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 8px;
  flex: 1;
  margin-right: 10px;
`;

const Select = styled.select`
  padding: 8px;
`;

const Card = styled.div`
  background: white;
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
`;

const FeedbackList = () => {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');

  const reviews = [
    { id: 1, content: '병원 분위기가 편안하고 좋아요.', date: '2024-05-03' },
    { id: 2, content: '김간호사님 정말 친절하세요!', date: '2024-05-01' },
    { id: 3, content: '대기 시간이 너무 길어요.', date: '2024-04-30' },
    { id: 4, content: '진료 예약 시스템이 불편해요.', date: '2024-04-28' },
  ];

  const filtered = reviews
    .filter(r => r.content.includes(search))
    .sort((a, b) => {
      return sortOrder === 'latest'
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    });

  return (
    <Container>
      <Title>📝 후기</Title>
      <Controls>
        <Input
          type="text"
          placeholder="내용 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </Select>
      </Controls>

      {filtered.map((f) => (
        <Card key={f.id}>
          <div>{f.content}</div>
          <div style={{ marginTop: '5px', color: '#888', fontSize: '13px' }}>
            {f.date}
          </div>
        </Card>
      ))}
    </Container>
  );
};

export default FeedbackList;
