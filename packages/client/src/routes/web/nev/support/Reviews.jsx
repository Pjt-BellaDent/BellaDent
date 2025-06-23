import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserInfo } from '../../../../contexts/UserInfoContext';

import LineImageBanner from '../../../../components/web/LineImageBanner';
import Container from '../../../../components/web/Container';
import RowBox from '../../../../components/web/RowBox';
import Title from '../../../../components/web/Title';
import Button from '../../../../components/web/Button';
import Text from '../../../../components/web/Text';
import BoardAdd from '../../../../components/web/BoardAdd';
import ReviewCreateForm from '../../../../components/web/ReviewCreateForm';

import line_banner from '../../../../assets/images/line_banner.png';

function Reviews() {
  const [activeReview, setActiveReview] = useState(false);
  const [posts, setPosts] = useState([]);
  const [disabledPosts, setDisabledPosts] = useState([]);
  const { userInfo, userToken } = useUserInfo();

  // --- 1. 전체 후기 목록 가져오기 ---
  useEffect(() => {
    if (userToken) {
      const url = 'http://localhost:3000/reviews';
      const readPosts = async () => {
        try {
          const res = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${userToken}`,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
            },
            withCredentials: true,
          });
          setPosts(res.data.reviews || []);
          console.log('Successfully fetched all reviews:', res.data.reviews);
        } catch (error) {
          console.error('Error fetching all reviews:', error);
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            alert('인증 오류: 전체 후기를 불러올 수 없습니다. 로그인해주세요.');
          }
          setPosts([]);
        }
      };
      readPosts();
    } else {
      setPosts([]);
      console.log(
        'Reviews: User token not available for all reviews fetch, skipping.'
      );
    }
  }, [userToken]);

  // --- 2. 내가 작성한 후기 중 비활성화 목록 가져오기 (authorId로 조회) ---
  useEffect(() => {
    if (userInfo?.id && userToken) {
      // URL을 /reviews/:id (authorId로 조회)로 그대로 사용
      const url = `http://localhost:3000/reviews/${userInfo.id}`;
      const readDisabledGets = async () => {
        try {
          const res = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${userToken}`,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
            },
            withCredentials: true,
          });
          setDisabledPosts(res.data.reviews || []); // { reviews: [...] } 형태
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.log(`No disabled reviews found for user ${userInfo.id}.`);
            setDisabledPosts([]);
          } else if (
            axios.isAxiosError(error) &&
            error.response?.status === 401
          ) {
            console.error(
              'Authentication error fetching disabled reviews:',
              error
            );
            alert(
              '인증 오류: 비활성화 후기를 불러올 수 없습니다. 다시 로그인해주세요.'
            );
            setDisabledPosts([]);
          } else {
            console.error('Error fetching disabled reviews:', error);
            setDisabledPosts([]);
          }
        }
      };
      readDisabledGets();
    } else {
      setDisabledPosts([]);
      console.log(
        'Reviews: User info or token not available, skipping disabled reviews fetch.'
      );
    }
  }, [userInfo, userToken]);

  return (
    <>
      <LineImageBanner
        CN="w-full h-40 flex justify-center items-center overflow-hidden"
        image={line_banner}
      >
        <Title as="h2" size="lg" CN="text-center">
          Welcome to Our Clinic
        </Title>
        <Text size="xl" CN="text-center">
          Your health is our priority
        </Text>
      </LineImageBanner>
      {userInfo && (
        <Container CN="py-40">
          <RowBox CN="justify-start items-center">
            <Title as="h2" size="lg">
              비활성화 이용 후기 목록
            </Title>
          </RowBox>
          <hr className="my-4" />
          <Text size="xl" CN="text-center my-4">
            제목
          </Text>
          <BoardAdd
            posts={disabledPosts}
            UL="mt-4 text-2xl cursor-pointer select-none"
            LI="my-4 text-lg duration-500 ease-in-out"
          />
        </Container>
      )}
      <Container CN="py-40">
        <RowBox CN="justify-between items-center">
          <Title as="h2" size="lg">
            이용 후기 목록
          </Title>
          <Button
            size="lg"
            onClick={() => {
              if (activeReview === false) {
                setActiveReview(!activeReview);
              }
            }}
          >
            이용 후기 작성
          </Button>
        </RowBox>
        <hr className="my-4" />
        {activeReview ? (
          <ReviewCreateForm
            activeReview={activeReview}
            setActiveReview={setActiveReview}
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
            />
          </>
        )}
      </Container>
    </>
  );
}

export default Reviews;
