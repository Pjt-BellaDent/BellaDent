import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const ITEMS_PER_PAGE = 10;

const FeedbackList = () => {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await getDocs(collection(db, 'reviews'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
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

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatDate = (timestamp) => {
    const d = timestamp?.toDate?.() || new Date(timestamp);
    return d.toISOString().split('T')[0];
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-8 h-8 border rounded ${
            currentPage === i
              ? 'bg-[#d2ae7e] text-white'
              : 'bg-white text-black'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="w-12 h-8 border rounded bg-white"
        >
          이전
        </button>
        {pageNumbers}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="w-12 h-8 border rounded bg-white"
        >
          다음
        </button>
      </div>
    );
  };

  return (
    <div className="px-8 py-10 bg-[#f4f7fc] min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">📝 후기</h2>

      <div className="flex justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="내용 검색"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // 검색 시 첫 페이지로 초기화
          }}
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
        {currentItems.map((f) => (
          <div key={f.id} className="bg-white p-5 rounded-xl shadow-md">
            <div className="text-gray-800 text-base">{f.content}</div>
            <div className="text-sm text-gray-500 mt-2">
              {formatDate(f.createdAt)}
            </div>

            {f.reviewImg?.length > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {f.reviewImg.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`리뷰 이미지 ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {renderPagination()}
    </div>
  );
};

export default FeedbackList;