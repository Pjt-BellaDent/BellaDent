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
      <ul className={CN} ref={navRef}>
        {pagedPosts.map((post, i) => (
          <li key={i + (page - 1) * pageSize}>
            <ul
              className={`${UL}`}
              onClick={() => setOnMenu(onMenu === i ? null : i)}
            >
              {post.title}
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
                {post.image && (
                  <div className="flex justify-center items-center py-10">
                    <img src={post.image} alt={post.image} />
                  </div>
                )}
                <p>{post.text}</p>
              </li>
            </ul>
          </li>
        ))}
      </ul>
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          이전
        </button>
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setPage(idx + 1)}
            className={`px-3 py-1 rounded ${
              page === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
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
