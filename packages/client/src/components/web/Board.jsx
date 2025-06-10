import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../contexts/UserInfoContext.jsx';
import ReviewUpdateForm from './ReviewUpdateForm.jsx';

function Board({ category, posts, CN, UL, LI, pageSize = 10 }) {
  const [onMenu, setOnMenu] = useState(null);
  const [page, setPage] = useState(1);
  const navRef = useRef();
  const textRefs = useRef([]);
  const { userInfo, userToken } = useUserInfo();
  const navigate = useNavigate();
  const [activeReview, setActiveReview] = useState(false);
  const [postId, setPostId] = useState(null);

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

  const handleEdit = () => {
    setPostId(pagedPosts[onMenu].id);
    setActiveReview(!activeReview);
  };
  const handleDelete = async () => {
    setPostId(pagedPosts[onMenu].id);
    try {
      await axios.delete(`http://localhost:3000/${category}/${postId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      alert('게시글이 삭제되었습니다.');
      navigate(0);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  return (
    <>
      {activeReview ? (
        <ReviewUpdateForm
          activeReview={activeReview}
          setActiveReview={setActiveReview}
          postId={postId}
        />
      ) : (
        <>
          <ul
            className={`border-y divide-y border-gray-300 divide-gray-300 ${CN}`}
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
                      <p className="text-gray-500 text-sm ">
                        {post.date}
                        <span className="mx-5">|</span>
                        {post.author}
                      </p>
                    </div>
                    {userInfo?.id === post.authorId && (
                      <div className="flex gap-4">
                        <button
                          type="button"
                          className="bg-blue-500 text-white w-40 py-4 rounded-2xl text-lg cursor-pointer"
                          onClick={handleEdit}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 text-white w-40 py-4 rounded-2xl text-lg cursor-pointer"
                          onClick={handleDelete}
                        >
                          삭제
                        </button>
                      </div>
                    )}
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
                    {post.image && (
                      <div className="flex flex-col w-full justify-center items-center gap-5 my-10">
                        <img
                          src={post.image}
                          alt={post.image}
                          className="w-full object-cover"
                        />
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
      )}
    </>
  );
}

export default Board;
