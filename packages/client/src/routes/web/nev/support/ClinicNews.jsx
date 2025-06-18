import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../config/firebase';

import LineImageBanner from '../../../../components/web/LineImageBanner';
import Container from '../../../../components/web/Container';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';
import Board from '../../../../components/web/Board';

import line_banner from '../../../../assets/images/line_banner.png';

function ClinicNews() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const q = query(collection(db, 'notices'), where('isPublic', '==', true));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          text: doc.data().content, // 내용이 body가 아닌 content일 가능성 있음
        }));
        setPosts(data);
      } catch (err) {
        console.error('공지사항 불러오기 실패:', err);
      }
    };

    fetchNotices();
  }, []);

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

export default ClinicNews;
