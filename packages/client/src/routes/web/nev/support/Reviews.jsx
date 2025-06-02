import { useState } from 'react';

import LineBanner from '../../../../components/web/LineBanner';
import Container from '../../../../components/web/Container';
import RowBox from '../../../../components/web/RowBox';
import Title from '../../../../components/web/Title';
import Button from '../../../../components/web/Button';
import Text from '../../../../components/web/Text';
import Board from '../../../../components/web/Board';
import ReviewAddForm from '../../../../components/ReviewAddForm';

function Reviews() {
  const posts = [
    {
      title: 'What is the purpose of this board?',
      text: 'This board',
    },
    {
      title: 'What is the purpose of this board?',
      text: 'This board',
    },
    {
      title: 'What is the purpose of this board?',
      text: 'This board',
    },
    {
      title: 'What is the purpose of this board?',
      text: 'This board',
    },
    {
      title: 'What is the purpose of this board?',
      text: 'This board',
    },
    {
      title: 'What is the purpose of this board?',
      text: 'This board',
    },
    {
      title: 'What is the purpose of this board?',
      text: 'This board',
    },
    {
      title: 'What is the purpose of this board?',
      text: 'This board',
    },
    {
      title: 'What is the purpose of this board?',
      text: 'This board',
    },
    {
      title: 'What is the purpose of this board?',
      text: 'This board',
    },
    {
      title: 'What is the purpose of this board?',
      text: 'This board',
    },
    {
      title: 'What is the purpose of this board?',
      text: 'This board',
    },
    {
      title: 'What is the purpose of this board?',
      text: 'This board',
    },
    {
      title: 'What is the purpose of this board?',
      text: 'This board',
    },
    {
      title: 'What is the purpose of this board?',
      text: 'This board',
    },
  ];
  const [activeReviewAdd, setActiveReviewAdd] = useState(false);

  return (
    <>
      <LineBanner CN="w-full h-40 bg-gray-400 flex flex-col justify-center items-center">
        <Title CN="text-4xl text-center">Welcome to Our Clinic</Title>
        <Text CN="text-xl text-center">Your health is our priority</Text>
      </LineBanner>
      <Container CN="py-40">
        <RowBox CN="justify-between items-center">
          <Title CN="text-4xl">Welcome to Our Clinic</Title>
          <Button
            CN="bg-blue-500 text-white w-40 py-4 rounded-2xl text-lg cursor-pointer"
            CLICK={() => {
              if (activeReviewAdd == false) {
                setActiveReviewAdd(!activeReviewAdd);
              }
            }}
          >
            이용 후기 작성
          </Button>
        </RowBox>
        <hr className="my-4" />
        {activeReviewAdd ? (
          <ReviewAddForm
            activeReviewAdd={activeReviewAdd}
            setActiveReviewAdd={setActiveReviewAdd}
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
