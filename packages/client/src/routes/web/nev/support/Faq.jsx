import React, { useState, useEffect } from 'react';
import axios from '../../../../libs/axiosInstance.js';

import LineImageBanner from '../../../../components/web/LineImageBanner';
import Container from '../../../../components/web/Container';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';
import Board from '../../../../components/web/Board';

import line_banner from '../../../../assets/images/line_banner.png';

function Faq() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const readPosts = async () => {
      try {
        const res = await axios.get('/faqs', {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
          withCredentials: true,
        });
        setPosts(res.data.faqs || []);
        console.log('FAQ 데이터 로드 성공:', res.data.faqs);
      } catch (error) {
        console.error('Error fetching faqs:', error);
        setPosts([]);
      }
    };
    // userToken 조건 없이 바로 호출합니다. (로그인 없이 접근 가능)
    readPosts();
  }, []); // 의존성 배열에서 userToken 제거

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
          자주 묻는 질문
        </Title>
        <Text size="xl" CN="text-center">
          Faq
        </Text>
      </LineImageBanner>
      <Container CN="py-40">
        <Title as="h2" size="lg">
          자주 묻는 질문
        </Title>
        <hr className="my-4" />
        <Text size="xl" CN="text-center my-4">
          제목
        </Text>
        <Board
          posts={posts}
          CN="border-y divide-y border-gray-300 divide-gray-300"
          UL="my-4 text-2xl cursor-pointer select-none"
          LI="my-4 text-lg duration-500 ease-in-out"
        />
      </Container>
    </>
  );
}

export default Faq;
