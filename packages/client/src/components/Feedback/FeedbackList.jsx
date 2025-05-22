import React, { useState } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 30px;
`;

const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
`;

const SearchControls = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const SearchBar = styled.input`
  padding: 8px;
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const FeedbackCard = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const Label = styled.span`
  display: inline-block;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  background-color: ${({ type }) => (type === '칭찬' ? '#28a745' : '#ffc107')};
  margin-bottom: 8px;
`;

const FeedbackViewer = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('전체');

  const feedbackList = [
    { id: 1, type: '칭찬', content: '김간호사님 정말 친절하세요!' },
    { id: 2, type: '건의', content: '대기 시간이 너무 길어요.' },
    { id: 3, type: '칭찬', content: '병원 분위기가 편안하고 좋아요.' },
    { id: 4, type: '건의', content: '진료 예약 시스템이 불편해요.' },
  ];

  const filtered = feedbackList.filter(f => {
    const matchesType = filterType === '전체' || f.type === filterType;
    const matchesSearch = f.content.includes(search);
    return matchesType && matchesSearch;
  });

  return (
    <Container>
      <Title>📝 고객의 소리</Title>
      <SearchControls>
        <SearchBar
          placeholder="내용 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="전체">전체</option>
          <option value="칭찬">칭찬</option>
          <option value="건의">건의</option>
        </Select>
      </SearchControls>
      {filtered.map(item => (
        <FeedbackCard key={item.id}>
          <Label type={item.type}>{item.type}</Label>
          <p>{item.content}</p>
        </FeedbackCard>
      ))}
    </Container>
  );
};

export default FeedbackViewer;