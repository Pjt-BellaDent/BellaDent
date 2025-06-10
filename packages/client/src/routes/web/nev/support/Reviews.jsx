import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserInfo } from '../../../../contexts/UserInfoContext';

import LineBanner from '../../../../components/web/LineBanner';
import Container from '../../../../components/web/Container';
import RowBox from '../../../../components/web/RowBox';
import Title from '../../../../components/web/Title';
import Button from '../../../../components/web/Button';
import Text from '../../../../components/web/Text';
import Board from '../../../../components/web/Board';
import ReviewCreateForm from '../../../../components/web/ReviewCreateForm';

function Reviews() {
  const [activeReview, setActiveReview] = useState(false);
  const [posts, setPosts] = useState([]);
  const [disabledPosts, setDisabledPosts] = useState([]);
  const { userInfo, userToken } = useUserInfo();

  useEffect(() => {
    const url = 'http://localhost:3000/reviews';
    const readPosts = async () => {
      try {
        const res = await axios.get(url);
        setPosts(res.data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    readPosts();
  }, []);

  if (userInfo !== undefined) {
    useEffect(() => {
      const url = `http://localhost:3000/reviews/${userInfo._id}`;
      const readDisabledPosts = async () => {
        try {
          const res = await axios.post(
            url,
            {},
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
              withCredentials: true,
            }
          );
          setDisabledPosts(res.data.reviews);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };
      readDisabledPosts();
    }, []);
  }

  return (
    <>
      <LineBanner CN="w-full h-40 bg-gray-400 flex flex-col justify-center items-center">
        <Title CN="text-4xl text-center">Welcome to Our Clinic</Title>
        <Text CN="text-xl text-center">Your health is our priority</Text>
      </LineBanner>
      {userInfo && (
        <Container CN="py-40">
          <RowBox CN="justify-start items-center">
            <Title CN="text-4xl">비활성화 이용 후기 목록</Title>
          </RowBox>
          <hr className="my-4" />
          <Text CN="text-2xl text-center my-4">제목</Text>
          <Board
            posts={disabledPosts}
            UL="mt-4 text-2xl cursor-pointer select-none"
            LI="my-4 text-lg duration-500 ease-in-out"
          />
        </Container>
      )}
      <Container CN="py-40">
        <RowBox CN="justify-between items-center">
          <Title CN="text-4xl">이용 후기 목록</Title>
          <Button
            CN="bg-blue-500 text-white w-40 py-4 rounded-2xl text-lg cursor-pointer"
            CLICK={() => {
              if (activeReview == false) {
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
            <Text CN="text-2xl text-center my-4">제목</Text>
            <Board
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
