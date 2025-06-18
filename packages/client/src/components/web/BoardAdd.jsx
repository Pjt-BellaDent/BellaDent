import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../contexts/UserInfoContext.jsx';
import ReviewUpdateForm from './ReviewUpdateForm.jsx';
import Modal from '../web/Modal.jsx';
import Title from '../web/Title.jsx';

function BoardAdd({ category, posts, CN, UL, LI, pageSize = 10 }) {
  const [onMenu, setOnMenu] = useState(null);
  const [page, setPage] = useState(1);
  const navRef = useRef();
  const textRefs = useRef([]);
  const { userInfo, userToken } = useUserInfo();
  const navigate = useNavigate();
  const [activeReview, setActiveReview] = useState(false);
  const [postId, setPostId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');

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
      setModalType('success');
      setModalMessage('게시글이 삭제되었습니다.');
      setShowModal(true);
    } catch (error) {
      console.error('Error deleting post:', error);
      setModalType('error');
      setModalMessage(error);
      setShowModal(true);
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
                    {userInfo?.id === post.authorId && (
                      <div className="flex gap-4">
                        <button
                          type="button"
                          className="flex items-center justify-center rounded-xl bg-BD-CharcoalBlack text-BD-ElegantGold outline-2 -outline-offset-2 outline-BD-CharcoalBlack px-6 py-3 text-xl text-nowrap shadow-xs hover:bg-BD-ElegantGold  hover-visible:outline-BD-ElegantGold hover:text-BD-CharcoalBlack focus:bg-BD-ElegantGold  focus-visible:outline-BD-ElegantGold focus:text-BD-CharcoalBlack duration-300"
                          onClick={handleEdit}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="flex items-center justify-center rounded-xl bg-BD-CoolGray text-BD-SoftGrayLine outline-2 -outline-offset-2 outline-BD-CoolGray px-6 py-3 text-xl text-nowrap shadow-xs hover:bg-BD-SoftGrayLine  hover-visible:outline-BD-SoftGrayLine hover:text-BD-CoolGray focus:bg-BD-SoftGrayLine  focus-visible:outline-BD-SoftGrayLine focus:text-BD-CoolGray duration-300"
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
          {modalType === 'success' && (
            <Modal
              show={showModal}
              setShow={setShowModal}
              activeClick={() => {
                setShowModal(false);
                navigate(0);
              }}
            >
              <Title>{modalMessage}</Title>
            </Modal>
          )}
          {modalType === 'error' && (
            <Modal
              show={showModal}
              setShow={setShowModal}
              activeClick={() => {
                setShowModal(false);
                navigate(0);
              }}
            >
              <Title>{modalMessage}</Title>
            </Modal>
          )}
        </>
      )}
    </>
  );
}

export default BoardAdd;
