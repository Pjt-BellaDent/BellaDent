import React from 'react';

import LineBanner from '../../../../components/web/LineBanner';
import Container from '../../../../components/web/Container';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';
import Board from '../../../../components/web/Board';

function ClinicNews() {
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
  ];
  return (
    <>
      <LineBanner CN="w-full h-40 bg-gray-400 flex flex-col justify-center items-center">
        <Title CN="text-4xl text-center">Welcome to Our Clinic</Title>
        <Text CN="text-xl text-center">Your health is our priority</Text>
      </LineBanner>
      <Container CN="py-40">
        <Title CN="text-4xl">Welcome to Our Clinic</Title>
        <hr className="my-4" />
        <Text CN="text-2xl text-center my-4">제목</Text>
        <Board
          posts={posts}
        
          UL="mt-4 text-2xl cursor-pointer select-none"
          LI="my-4 text-lg duration-500 ease-in-out"
        />
      </Container>
    </>
  );
}

export default ClinicNews;
