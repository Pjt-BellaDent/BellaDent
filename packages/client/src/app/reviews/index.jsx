import React, { useState } from 'react';

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
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">📝 후기</h2>

      <div className="flex justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="내용 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded"
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((f) => (
          <div key={f.id} className="bg-white p-4 rounded-lg shadow">
            <div className="text-base text-gray-800">{f.content}</div>
            <div className="text-sm text-gray-500 mt-1">{f.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;
