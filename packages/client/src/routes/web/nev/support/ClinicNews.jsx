import { useState, useEffect } from 'react';
import { useUserInfo } from '../../../../contexts/UserInfoContext';
import axios from 'axios';

import LineImageBanner from '../../../../components/web/LineImageBanner';
import Container from '../../../../components/web/Container';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';
import Board from '../../../../components/web/Board';

import line_banner from '../../../../assets/images/line_banner.png';

function ClinicNews() {
  const [posts, setPosts] = useState([]);
  const { userToken } = useUserInfo();

  useEffect(() => {
    const url = 'http://localhost:3000/notices';
    const readPosts = async () => {
      try {
        const res = await axios.get(
          url,
          {},
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
            withCredentials: true,
          }
        );
        setPosts(res.data.notices);
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
    };
    readPosts();
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
          CN="border-y divide-y border-gray-300 divide-gray-300"
          UL="my-4 text-2xl cursor-pointer select-none"
          LI="my-4 text-lg duration-500 ease-in-out"
        />
      </Container>
    </>
  );
}

export default ClinicNews;
