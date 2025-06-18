import { useState, useEffect, useRef } from 'react';

function Board({ posts, CN, UL, LI, pageSize = 10 }) {
  const [onMenu, setOnMenu] = useState(null);
  const [page, setPage] = useState(1);
  const navRef = useRef();
  const textRefs = useRef([]);
  const totalPages = Math.ceil(posts.length / pageSize);
  const pagedPosts = posts.slice((page - 1) * pageSize, page * pageSize);

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
          <li key={i + (page - 1) * pageSize}>
            <ul>
              <div className="flex justify-between items-center">
                <div
                  className={`w-full`}
                  onClick={() => setOnMenu(onMenu === i ? null : i)}
                >
                  <h3 className={`${UL}`}>{post.title} </h3>
                  <p className="text-BD-CoolGray text-sm ">
                    {post.date}
                    <span className="mx-5">|</span>
                    {post.author}
                  </p>
                </div>
              </div>
              <li
                ref={(el) => (textRefs.current[i] = el)}
                className={`overflow-hidden ${LI}`}
                style={{
                  maxHeight:
                    onMenu === i && textRefs.current[i]
                      ? textRefs.current[i].scrollHeight + 'px'
                      : '0',
                }}
              >
                <p>{post.content}</p>
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
