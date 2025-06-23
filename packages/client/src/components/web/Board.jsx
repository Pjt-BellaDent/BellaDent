import React, { useState, useEffect, useRef } from 'react';
import Title from './Title';
import Text from './Text';

function Board({ posts, CN, UL, LI, pageSize = 10 }) {
  const [onMenu, setOnMenu] = useState(null);
  const [page, setPage] = useState(1);
  const navRef = useRef();
  const textRefs = useRef([]);

  const totalPages = Math.ceil(posts.length / pageSize);
  const pagedPosts = posts.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setOnMenu(null);
    textRefs.current = [];
  }, [page, posts]);

  useEffect(() => {
    // onMenu 상태가 변경될 때마다 maxHeight를 업데이트.
    // DOM 업데이트가 완전히 반영된 후에 scrollHeight를 읽기 위해 setTimeout 사용.
    if (onMenu !== null && textRefs.current[onMenu]) {
      const currentTextRef = textRefs.current[onMenu];
      // 0ms 지연으로 다음 이벤트 루프 틱에 실행.
      const timeoutId = setTimeout(() => {
        if (currentTextRef) {
          // console.log(`Item ${onMenu} scrollHeight:`, currentTextRef.scrollHeight); // 디버깅용 로그
          currentTextRef.style.maxHeight = `${currentTextRef.scrollHeight}px`;
        }
      }, 0);
      return () => clearTimeout(timeoutId); // 클린업 함수에서 타이머 해제
    } else if (onMenu === null) {
      // 모든 드롭다운을 닫을 때 (onMenu가 null이 될 때)
      textRefs.current.forEach((ref) => {
        if (ref) ref.style.maxHeight = '0px';
      });
    }
  }, [onMenu]); // onMenu가 변경될 때만 실행

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOnMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <ul
        className={`border-y divide-y border-BD-SoftGrayLine divide-BD-SoftGrayLine ${CN}`}
        ref={navRef}
      >
        {pagedPosts.map((post, i) => (
          <li key={post.id || i + (page - 1) * pageSize}>
            <ul>
              <div
                className="flex justify-between items-center py-4 px-3 cursor-pointer"
                onClick={() => setOnMenu(onMenu === i ? null : i)}
              >
                <div className={`flex-1`}>
                  <Title as="h3" size="md" CN={`${UL} truncate`}>
                    {post.title}
                  </Title>
                  <Text as="p" size="xs" CN="text-BD-CoolGray text-sm">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString('ko-KR')
                      : ''}
                    <span className="mx-2">|</span>
                    {post.authorName || post.authorId || '알 수 없음'}
                  </Text>
                </div>
              </div>
              <li
                ref={(el) => (textRefs.current[i] = el)}
                className={`overflow-hidden transition-all duration-500 ease-in-out ${LI}`}
                style={{
                  // 여기가 핵심: 초기에는 0, 열릴 때는 scrollHeight를 적용.
                  // onMenu가 i와 같고 textRefs.current[i]가 존재할 때만 scrollHeight를 계산.
                  maxHeight:
                    onMenu === i
                      ? textRefs.current[i]?.scrollHeight
                        ? `${textRefs.current[i].scrollHeight}px`
                        : 'auto' // textRefs.current[i]가 null이거나 scrollHeight가 0일 경우 'auto' 또는 큰 고정값으로 폴백
                      : '0',
                }}
              >
                {/* Board 컴포넌트에서는 imageUrls가 없을 수 있으므로 조건부 렌더링. */}
                {/* posts 데이터 구조에 imageUrls가 없다면 이 부분은 제거하거나 BoardAdd에서만 사용하도록 분리해야 합니다. */}
                {post.imageUrls && post.imageUrls.length > 0 && (
                  <div className="flex flex-col w-full justify-center items-center gap-5 my-10">
                    {post.imageUrls.map((imageUrl, imgIdx) => (
                      <img
                        key={imgIdx}
                        src={imageUrl}
                        alt={`image-${imgIdx}`}
                        className="w-full object-cover max-w-lg rounded-md"
                      />
                    ))}
                  </div>
                )}
                <Text as="p" size="md" className="p-3 bg-gray-50 rounded-b-lg">
                  {post.content}
                </Text>
              </li>
            </ul>
          </li>
        ))}
      </ul>
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-BD-SoftGrayLine disabled:opacity-50"
        >
          이전
        </button>
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setPage(idx + 1)}
            className={`px-3 py-1 rounded ${
              page === idx + 1
                ? 'bg-BD-ElegantGold text-BD-PureWhite'
                : 'bg-BD-SoftGrayLine'
            }`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </>
  );
}

export default Board;
