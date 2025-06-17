import React from 'react';

import LineImageBanner from '../../../../components/web/LineImageBanner';
import Container from '../../../../components/web/Container';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';
import Board from '../../../../components/web/Board';

import line_banner from '../../../../assets/images/line_banner.png';

function faq() {
  const posts = [
    {
      id:'81347298147142309r',
      title: 'What is the purpose of this board?',
      text: 'This board',
      date: '2023-10-01',
      author: 'Admin',
    },
    {
      id:'81347298147142309r',
      title: 'What is the purpose of this board?',
      text: 'This board',
      date: '2023-10-01',
      author: 'Admin',
    },
    {
      id:'81347298147142309r',
      title: 'What is the purpose of this board?',
      text: 'This board',
      date: '2023-10-01',
      author: 'Admin',
    },
    {
      id:'81347298147142309r',
      title: 'What is the purpose of this board?',
      text: 'This board',
      date: '2023-10-01',
      author: 'Admin',
    },
    {
      id:'81347298147142309r',
      title: 'What is the purpose of this board?',
      text: 'This board',
      date: '2023-10-01',
      author: 'Admin',
    },
    {
      id:'81347298147142309r',
      title: 'What is the purpose of this board?',
      text: 'This board',
      date: '2023-10-01',
      author: 'Admin',
    },

  ];
  return (
    <>
      <LineImageBanner
        CN="w-full h-40 flex justify-center items-center overflow-hidden"
        image={line_banner}
      >
        <Title CN="text-4xl text-center">Welcome to Our Clinic</Title>
        <Text CN="text-xl text-center">Your health is our priority</Text>
      </LineImageBanner>
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

export default faq;
