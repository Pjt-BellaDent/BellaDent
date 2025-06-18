import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const FeedbackList = () => {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');

  useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await getDocs(collection(db, 'reviews'));
      const data = snapshot.docs.map(doc => doc.data());
      const publicReviews = data.filter((r) => r.isPublic !== false);
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
    <div className="px-8 py-10 bg-[#f4f7fc] min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">📝 후기</h2>

      <div className="flex justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="내용 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((f) => (
          <div
            key={f.id}
            className="bg-white p-5 rounded-xl shadow-md"
          >
            <div className="text-gray-800 text-base">{f.content}</div>
            <div className="text-sm text-gray-500 mt-2">
              {formatDate(f.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;
