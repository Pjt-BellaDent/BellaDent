import React, { useState, useEffect } from 'react';
import axios from '../../../libs/axiosInstance.js';

const ITEMS_PER_PAGE = 10;

const FeedbackList = () => {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/reviews');
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error('리뷰 불러오기 실패:', err);
        setError('리뷰를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // ★★★ 수정된 부분: handleTogglePublicStatus 함수 ★★★
  const handleTogglePublicStatus = async (reviewId, currentIsPublic) => {
    try {
      if (currentIsPublic) {
        // 현재 isPublic이 true이면 -> 비활성화 (disabledReview 호출)
        await axios.put(`/reviews/disabled/${reviewId}`); // disabledReview API 호출
      } else {
        // 현재 isPublic이 false이면 -> 활성화 (enableReview 호출)
        await axios.put(`/reviews/enable/${reviewId}`); // enableReview API 호출
      }

      // API 호출 성공 시 로컬 상태 업데이트
      setReviews((prevReviews) =>
        prevReviews.map((review) => {
          if (review.id === reviewId) {
            const newIsPublic = !currentIsPublic;
            const newApproved = newIsPublic ? true : review.approved; // 활성화 시 approved도 true로
            return {
              ...review,
              isPublic: newIsPublic,
              approved: newApproved,
              updatedAt: new Date(), // 업데이트 시간 반영 (필요시)
            };
          }
          return review;
        })
      );
      console.log(
        `리뷰 ${reviewId}의 공개 상태를 ${!currentIsPublic}으로 변경했습니다.`
      );
    } catch (err) {
      console.error('공개 상태 변경 실패:', err);
      // 서버에서 403 (권한 없음) 에러가 올 수도 있으므로, 상세 메시지 전달
      alert(err.response?.data?.message || '공개 상태 변경에 실패했습니다.');
    }
  };

  const filtered = reviews
    .filter(
      (r) =>
        (r.content || '').includes(search) || (r.title || '').includes(search)
    )
    .sort((a, b) => {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);
      return sortOrder === 'latest' ? bDate - aDate : aDate - bDate;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatDate = (timestamp) => {
    const d = new Date(timestamp);
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
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="w-12 h-8 border rounded bg-white"
        >
          다음
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="px-8 py-10 bg-[#f4f7fc] min-h-screen text-center">
        리뷰를 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-10 bg-[#f4f7fc] min-h-screen text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="px-8 py-10 bg-[#f4f7fc] min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">📝 후기 관리</h2>

      <div className="flex justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="제목 또는 내용 검색"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
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
        {currentItems.length > 0 ? (
          currentItems.map((f) => (
            <div key={f.id} className="bg-white p-5 rounded-xl shadow-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {f.title || '제목 없음'}
                </h3>
                {f.isPublic === false && f.approved === false && (
                  <span className="bg-yellow-200 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    승인 대기 중
                  </span>
                )}
                {/* isPublic 상태에 따라 활성/비활성 상태 표시 */}
                {f.isPublic === true && f.approved === true && (
                  <span className="bg-green-200 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    활성화
                  </span>
                )}
                {f.isPublic === false &&
                  f.approved === true && ( // 승인되었으나 비공개 상태
                    <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      비활성화 (관리자)
                    </span>
                  )}
              </div>
              <div className="text-gray-800 text-base">{f.content}</div>
              <div className="text-sm text-gray-500 mt-2">
                {formatDate(f.createdAt)}
              </div>

              {f.imageUrls?.length > 0 && ( // f.reviewImg 대신 f.imageUrls 사용
                <div className="mt-3 flex gap-2 flex-wrap">
                  {f.imageUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`리뷰 이미지 ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                  ))}
                </div>
              )}

              <div className="mt-4 flex gap-2 justify-end">
                <button
                  onClick={() => handleTogglePublicStatus(f.id, f.isPublic)}
                  className={`px-4 py-2 rounded-md text-white font-medium ${
                    f.isPublic
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {f.isPublic ? '비활성화' : '활성화'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">조회된 후기가 없습니다.</p>
        )}
      </div>

      {renderPagination()}
    </div>
  );
};

export default FeedbackList;
