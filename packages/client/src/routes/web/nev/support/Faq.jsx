// src/routes/web/nev/support/Faq.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import LineImageBanner from '../../../../components/web/LineImageBanner';
import Container from '../../../../components/web/Container';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';
import Board from '../../../../components/web/Board';

import line_banner from '../../../../assets/images/line_banner.png';

function Faq() {
  const [posts, setPosts] = useState([]);
  // const { userToken } = useUserInfo(); // userToken은 이제 API 호출 조건에 사용되지 않음

  useEffect(() => {
    const url = 'http://localhost:3000/faqs';
    const readPosts = async () => {
      try {
        const res = await axios.get(url, {
          headers: {
            // Authorization 헤더는 userToken이 없으므로 제거 (로그인 없이 접근 가능)
            // 'Authorization': `Bearer ${userToken}`, // <-- 이 줄을 제거합니다!
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
          withCredentials: true, // 크리덴셜은 계속 보내지만, 토큰이 없으면 무시됨
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
        CN="w-full h-40 flex justify-center items-center overflow-hidden"
        image={line_banner}
      >
        <Title as="h2" size="lg" CN="text-center">Welcome to Our Clinic</Title>
        <Text size="xl" CN="text-center">Your health is our priority</Text>
      </LineImageBanner>
      <Container CN="py-40">
        <Title as="h2" size="lg">Welcome to Our Clinic</Title>
        <hr className="my-4" />
        <Text size="xl" CN="text-center my-4">제목</Text>
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