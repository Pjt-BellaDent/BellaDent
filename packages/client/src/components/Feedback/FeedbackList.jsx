import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

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
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');

  useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await getDocs(collection(db, 'reviews'));
      const data = snapshot.docs.map(doc => doc.data());
      const publicReviews = data.filter((r) => r.isPublic !== false); // 비공개 제외
      setReviews(publicReviews);
    };
    fetchReviews();
  }, []);

  const filtered = reviews
    .filter(r => (r.content || '').includes(search))
    .sort((a, b) => {
      const aDate = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const bDate = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return sortOrder === 'latest' ? bDate - aDate : aDate - bDate;
    });

  const formatDate = (timestamp) => {
    const d = timestamp?.toDate?.() || new Date(timestamp);
    return d.toISOString().split('T')[0];
  };

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
            {formatDate(f.createdAt)}
          </div>
        </Card>
      ))}
    </Container>
  );
};

export default FeedbackList;
