import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../contexts/UserInfoContext.jsx';
import ReviewUpdateForm from './ReviewUpdateForm.jsx';
import Modal from '../web/Modal.jsx';
import Title from '../web/Title.jsx';
import Button from '../web/Button';
import Text from './Text';

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

  const handleEdit = (postIdToEdit) => {
    setPostId(postIdToEdit);
    setActiveReview(true);
  };

  const confirmDelete = (postIdToDelete) => {
    setPostId(postIdToDelete);
    setModalType('choice');
    setModalMessage('정말로 이 게시글을 삭제하시겠습니까?');
    setShowModal(true);
  };

  const executeDelete = async () => {
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
      setModalMessage(
        error.response?.data?.message || '게시글 삭제 중 오류가 발생했습니다.'
      );
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
              <li key={post.id || i + (page - 1) * pageSize}>
                <ul>
                  <div
                    className="flex justify-between items-center py-4 px-3 cursor-pointer"
                    onClick={() => setOnMenu(onMenu === i ? null : i)}
                  >
                    <div className={`flex-1`}>
                      <Title as="h3" size="md" CN={`${UL} truncate`}>
                        {post.title}{' '}
                      </Title>
                      <Text as="p" size="xs" CN="text-BD-CoolGray text-sm">
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString('ko-KR')
                          : ''}
                        <span className="mx-2">|</span>
                        {post.authorName || post.authorId || '알 수 없음'}
                      </Text>
                    </div>
                    {userInfo?.id === post.authorId && (
                      <div
                        className="flex gap-4 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          type="button"
                          size="md"
                          onClick={() => handleEdit(post.id)}
                        >
                          수정
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          size="md"
                          onClick={() => confirmDelete(post.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    )}
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
                            alt={`review-image-${imgIdx}`}
                            className="w-full object-cover max-w-lg rounded-md"
                          />
                        ))}
                      </div>
                    )}
                    <Text
                      as="p"
                      size="md"
                      className="p-3 bg-gray-50 rounded-b-lg"
                    >
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
                variant={page === idx + 1 ? 'primary' : 'secondary'}
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
          {showModal && (
            <Modal
              show={showModal}
              setShow={setShowModal}
              activeClick={() => {
                setShowModal(false);
                if (modalType === 'success') {
                  navigate(0);
                } else if (modalType === 'choice') {
                  executeDelete();
                }
              }}
              activeClose={
                modalType === 'choice'
                  ? () => {
                      setShowModal(false);
                    }
                  : undefined
              }
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
