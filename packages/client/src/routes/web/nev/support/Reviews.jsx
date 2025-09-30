import React, { useState, useEffect } from 'react';
import axios from '../../../../libs/axiosInstance.js';
import { useUserInfo } from '../../../../contexts/UserInfoContext';
import { useNavigate } from 'react-router-dom';

import LineImageBanner from '../../../../components/web/LineImageBanner';
import Container from '../../../../components/web/Container';
import RowBox from '../../../../components/web/RowBox';
import Title from '../../../../components/web/Title';
import Button from '../../../../components/web/Button';
import Text from '../../../../components/web/Text';
import BoardAdd from '../../../../components/web/BoardAdd';
import ReviewCreateForm from '../../../../components/web/ReviewCreateForm';
import ReviewUpdateForm from '../../../../components/web/ReviewUpdateForm.jsx';
import Modal from '../../../../components/web/Modal.jsx'; // Modal 컴포넌트 추가

import line_banner from '../../../../assets/images/line_banner.png';

function Reviews() {
  const navigate = useNavigate();
  const [activeReview, setActiveReview] = useState(false);
  const [activeUpdateReview, setActiveUpdateReview] = useState(false);
  const [postIdToUpdate, setPostIdToUpdate] = useState(null);

  const [posts, setPosts] = useState([]);
  const [disabledPosts, setDisabledPosts] = useState([]);
  const { userInfo, userToken, loading: userInfoLoading } = useUserInfo();

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'success', 'error'

  const fetchAllReviews = async () => {
    if (!userToken && !userInfoLoading) {
      setPosts([]);
      return;
    }
    try {
      const res = await axios.get('/reviews', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
        withCredentials: true,
      });
      setPosts(res.data.reviews || []);
    } catch (error) {
      if (error.response?.status === 401) {
        setModalType('error');
        setModalMessage(
          '인증 오류: 전체 후기를 불러올 수 없습니다. 로그인해주세요.'
        );
        setShowModal(true);
      }
      setPosts([]);
    }
  };

  const fetchDisabledReviews = async () => {
    if (!userInfo?.id || !userToken || userInfoLoading) {
      setDisabledPosts([]);
      return;
    }
    const url = `/reviews/disabled/${userInfo.id}`;
    try {
      const res = await axios.get(url, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
        withCredentials: true,
      });
      setDisabledPosts(res.data.reviews || []);
    } catch (error) {
      if (error.response?.status === 404) {
        setDisabledPosts([]);
      } else if (error.response?.status === 401) {
        setModalType('error');
        setModalMessage(
          '인증 오류: 비활성화 후기를 불러올 수 없습니다. 다시 로그인해주세요.'
        );
        setShowModal(true);
        setDisabledPosts([]);
      } else {
        setDisabledPosts([]);
      }
    }
  };

  useEffect(() => {
    if (!userInfoLoading) {
      fetchAllReviews();
      fetchDisabledReviews();
    }
  }, [userToken, userInfo, userInfoLoading]);

  const handleReviewActionSuccess = () => {
    fetchAllReviews();
    fetchDisabledReviews();
    setActiveReview(false);
    setActiveUpdateReview(false);
    setPostIdToUpdate(null);
  };

  const handleEditClick = (postId) => {
    setPostIdToUpdate(postId);
    setActiveUpdateReview(true);
  };

  const handleCreateReviewClick = () => {
    if (!userInfo || !userToken) {
      setModalType('error');
      setModalMessage('이용 후기를 작성하려면 로그인해야 합니다.');
      setShowModal(true);
      return;
    }
    setActiveReview(true);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    if (modalType === 'error' && modalMessage.includes('로그인')) {
      navigate('/login');
    }
  };

  return (
    <>
      <LineImageBanner
        CN="w-full h-30 flex justify-center items-center overflow-hidden object-cover"
        image={line_banner}
      >
        <Title
          as="h2"
          size="lg"
          CN="text-center text-BD-CharcoalBlack text-shadow-lg/20"
        >
          치료 후기 게시판
        </Title>
        <Text size="xl" CN="text-center">
          Reviews
        </Text>
      </LineImageBanner>

      <Container CN="py-40">
        <RowBox CN="justify-between items-center">
          <Title as="h2" size="lg">
            치료 후기 게시판
          </Title>
          <Button size="lg" onClick={handleCreateReviewClick}>
            치료 후기 작성
          </Button>
        </RowBox>
        <hr className="my-4" />
        {activeReview ? (
          <ReviewCreateForm
            activeReview={activeReview}
            setActiveReview={setActiveReview}
            onReviewCreated={handleReviewActionSuccess}
          />
        ) : activeUpdateReview ? (
          <ReviewUpdateForm
            postId={postIdToUpdate}
            activeReview={activeUpdateReview}
            setActiveReview={setActiveUpdateReview}
            onReviewUpdated={handleReviewActionSuccess}
          />
        ) : (
          <>
            <Text size="xl" CN="text-center my-4">
              제목
            </Text>
            <BoardAdd
              posts={posts}
              CN="border-y divide-y border-gray-300 divide-gray-300"
              UL="my-4 text-2xl cursor-pointer select-none"
              LI="my-4 text-lg duration-500 ease-in-out"
              onActionSuccess={handleReviewActionSuccess}
              onEditClick={handleEditClick}
              category="reviews"
            />
          </>
        )}
      </Container>

      {userInfo && (
        <Container CN="py-40">
          <RowBox CN="justify-start items-center">
            <Title as="h2" size="lg">
              비활성화 치료 후기 목록
            </Title>
          </RowBox>
          <hr className="my-4" />
          <Text size="xl" CN="text-center my-4">
            제목
          </Text>
          <BoardAdd
            posts={disabledPosts}
            CN="border-y divide-y border-gray-300 divide-gray-300"
            UL="mt-4 text-2xl cursor-pointer select-none"
            LI="my-4 text-lg duration-500 ease-in-out"
            onActionSuccess={handleReviewActionSuccess}
            onEditClick={handleEditClick}
            category="reviews"
          />
        </Container>
      )}

      {showModal && (
        <Modal
          show={showModal}
          setShow={setShowModal}
          activeClick={handleModalConfirm}
        >
          <Title>{modalMessage}</Title>
        </Modal>
      )}
    </>
  );
}

export default Reviews;
