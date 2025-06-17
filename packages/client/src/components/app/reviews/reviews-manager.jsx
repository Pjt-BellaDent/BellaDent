import React, { useState } from 'react';

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
