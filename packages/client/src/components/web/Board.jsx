// src/components/web/Board.jsx
import React, { useState, useEffect, useRef } from 'react';
import Title from './Title';
import Text from './Text';
import Button from './Button';

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
    if (onMenu !== null && textRefs.current[onMenu]) {
      const currentTextRef = textRefs.current[onMenu];
      const timeoutId = setTimeout(() => {
        if (currentTextRef) {
          currentTextRef.style.maxHeight = `${currentTextRef.scrollHeight}px`;
        }
      }, 0);
      return () => clearTimeout(timeoutId);
    } else if (onMenu === null) {
      textRefs.current.forEach((ref) => {
        if (ref) ref.style.maxHeight = '0px';
      });
    }
  }, [onMenu]);

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
                  maxHeight:
                    onMenu === i
                      ? textRefs.current[i]?.scrollHeight
                        ? `${textRefs.current[i].scrollHeight}px`
                        : 'auto'
                      : '0',
                }}
              >
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
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          이전
        </Button>
        {Array.from({ length: totalPages }, (_, idx) => (
          <Button
            key={idx + 1}
            size="sm"
            variant={page === idx + 1 ? 'positive' : 'secondary'}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </Button>
        ))}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          다음
        </Button>
      </div>
    </>
  );
}

export default Board;
