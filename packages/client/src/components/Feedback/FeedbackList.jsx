import React, { useState } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 30px;
`;

const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
`;

const Controls = styled.div`
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
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const FeedbackCard = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  cursor: pointer;
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

const Modal = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: 'Noto Sans KR', sans-serif;

  h4 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  p {
    font-size: 15px;
    margin-bottom: 12px;
    color: #333;
  }

  small {
    font-size: 13px;
    color: #888;
  }

  button {
    margin-top: 15px;
    padding: 8px 16px;
    border: none;
    background-color: #6699FF;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    float: right;
  }
`;

const FeedbackViewer = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('전체');
  const [sort, setSort] = useState('최신순');
  const [selected, setSelected] = useState(null);

  const feedbackList = [
    { id: 1, type: '칭찬', content: '김간호사님 정말 친절하세요!', date: '2024-05-01' },
    { id: 2, type: '건의', content: '대기 시간이 너무 길어요.', date: '2024-04-30' },
    { id: 3, type: '칭찬', content: '병원 분위기가 편안하고 좋아요.', date: '2024-05-03' },
    { id: 4, type: '건의', content: '진료 예약 시스템이 불편해요.', date: '2024-04-28' },
  ];

  const filtered = feedbackList
    .filter(f => (filterType === '전체' || f.type === filterType))
    .filter(f => f.content.includes(search))
    .sort((a, b) => sort === '최신순' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date));

  return (
    <Container>
      <Title>📝 고객의 소리</Title>
      <Controls>
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
        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="최신순">최신순</option>
          <option value="오래된순">오래된순</option>
        </Select>
      </Controls>

      {filtered.map(item => (
        <FeedbackCard key={item.id} onClick={() => setSelected(item)}>
          <Label type={item.type}>{item.type}</Label>
          <p>{item.content}</p>
          <small style={{ color: '#666' }}>{item.date}</small>
        </FeedbackCard>
      ))}

      {selected && (
        <Modal onClick={() => setSelected(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h4>{selected.type}</h4>
            <p>{selected.content}</p>
            <small>{selected.date}</small>
            <button onClick={() => setSelected(null)}>닫기</button>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default FeedbackViewer;
