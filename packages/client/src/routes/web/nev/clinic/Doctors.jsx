import React, { useState } from 'react';
import ScrollFadeIn from '../../../../components/web/ScrollFadeIn';

import LineImageBanner from '../../../../components/web/LineImageBanner';
import LineBanner from '../../../../components/web/LineBanner';
import Wrapper from '../../../../components/web/Wrapper';
import Container from '../../../../components/web/Container';
import Card from '../../../../components/web/Card';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';
import Button from '../../../../components/web/Button'; // 수정된 Button 컴포넌트 임포트
import RowBox from '../../../../components/web/RowBox';
import ImageBox from '../../../../components/web/ImageBox';

import doctor_1_sec_1_1 from '../../../../assets/images/doctor_1_sec_1_1.png';
import doctor_1_sec_1_2 from '../../../../assets/images/doctor_1_sec_1_2.png';
import doctor_2_sec_1_1 from '../../../../assets/images/doctor_2_sec_1_1.png';
import doctor_2_sec_1_2 from '../../../../assets/images/doctor_2_sec_1_2.png';
import doctor_3_sec_1_1 from '../../../../assets/images/doctor_3_sec_1_1.png';
import doctor_3_sec_1_2 from '../../../../assets/images/doctor_3_sec_1_2.png';
import doctor_sec_1_1 from '../../../../assets/images/doctor_sec_1_1.png';
import doctor_sec_1_2 from '../../../../assets/images/doctor_sec_1_2.png';
import doctor_sec_1_3 from '../../../../assets/images/doctor_sec_1_3.png';
import doctor_sec_1_4 from '../../../../assets/images/doctor_sec_1_4.png';
import doctor_sec_1_5 from '../../../../assets/images/doctor_sec_1_5.png';
import doctor_sec_1_6 from '../../../../assets/images/doctor_sec_1_6.png';
import doctor_sec_1_7 from '../../../../assets/images/doctor_sec_1_7.png';
import doctor_sec_1_8 from '../../../../assets/images/doctor_sec_1_8.png';
import doctor_sec_1_9 from '../../../../assets/images/doctor_sec_1_9.png';
import line_banner from '../../../../assets/images/line_banner.png'; // 추가 임포트

function Doctors() {
  const [activeTab, setActiveTab] = useState('doctor1');
  const bg_image_02 = [
    doctor_sec_1_1,
    doctor_sec_1_2,
    doctor_sec_1_3,
    doctor_sec_1_4,
    doctor_sec_1_5,
    doctor_sec_1_6,
    doctor_sec_1_7,
    doctor_sec_1_8,
    doctor_sec_1_9,
  ];

  const doctorImages = {
    doctor1: {
      card: doctor_1_sec_1_1,
      banner: doctor_1_sec_1_2,
    },
    doctor2: {
      card: doctor_2_sec_1_1,
      banner: doctor_2_sec_1_2,
    },
    doctor3: {
      card: doctor_3_sec_1_1,
      banner: doctor_3_sec_1_2,
    },
  };

  return (
    <>
      <LineImageBanner
        CN="w-full h-40 flex justify-center items-center overflow-hidden"
        image={line_banner}
      >
        <div className="flex flex-col justify-center items-center">
          <Title as="h1" size="lg" CN="text-center">
            의료진 소개
          </Title>
          <Text size="md" CN="text-center">
            medical staff introduction{' '}
          </Text>
        </div>
      </LineImageBanner>

      <Container CN="pt-20">
        <ul className="flex justify-center items-center pb-40 divide-x-2">
          <li
            className="w-80 py-2 text-xl text-center cursor-pointer"
            onClick={() => setActiveTab('doctor1')}
          >
            정하늘 대표원장
          </li>
          <li
            className="w-80 py-2 text-xl text-center cursor-pointer"
            onClick={() => setActiveTab('doctor2')}
          >
            김수민 부원장
          </li>
          <li
            className="w-80 py-2 text-xl text-center cursor-pointer"
            onClick={() => setActiveTab('doctor3')}
          >
            박정우 과장
          </li>
        </ul>

        <Card
          image={doctorImages[activeTab]?.card}
          CN="px-5 flex flex-row-reverse justify-between gap-12 pb-120"
        >
          <Title as="h2" size="lg" CN="text-center">
            정하늘 대표원장
          </Title>
          <Text size="lg" CN="mt-6 text-center">
            전문 분야: 심미치료 (라미네이트, 잇몸성형, 세라믹보철)
          </Text>
          <Text as="h3" size="lg" CN="mt-6 text-center">
            BellaDent 을 찾아주셔서 감사합니다. 대표원장 정하늘입니다. 저는
            라미네이트, 잇몸성형, 세라믹 보철 등 심미치료 분야에 대한 깊은
            연구와 풍부한 임상 경험을 바탕으로 진료합니다. 단순히 보기 좋은
            치아를 넘어, 환자분의 얼굴과 조화를 이루는 개개인 맞춤형 디자인을
            추구하며, 진료 과정의 모든 순간을 사진 기록으로 꼼꼼히 관리하여
            신뢰할 수 있는 결과를 약속드립니다. BellaDent 에서 당신의 완벽한
            미소를 경험하세요.
          </Text>
          <Text size="lg" CN="mt-6 text-center">
            - 상담/진료 전후 사진 관리 - 환자 유형별 추천 치료코스 저장 기능 -
            카카오채널 기반 1:1 상담 로그 연동
          </Text>
        </Card>
        <ScrollFadeIn delay={0.5}>
          <Title as="h2" size="lg" CN="text-center pb-10">
            Welcome to Our Clinic
          </Title>
        </ScrollFadeIn>
      </Container>

      <LineBanner CN="w-full h-40 bg-gray-400 flex justify-center">
        <div className="w-320 mx-auto flex justify-between items-end">
          <RowBox CN="h-full items-center gap-4">
            <Text size="lg" CN="text-center">
              Your health is our priority
            </Text>
            <Text size="lg" CN="text-center">
              Your health is our priority
            </Text>
          </RowBox>
          <div>
            <img
              src={doctorImages[activeTab]?.banner}
              alt={doctorImages[activeTab]?.banner}
              className="max-w-100"
            />
          </div>
        </div>
      </LineBanner>

      <Wrapper CN="pt-20 pb-40">
        <hr />
        <Container CN="py-10">
          <RowBox>
            <div>
              <Text size="md">의료진</Text>
              <Title as="h2" size="lg">
                BellaDent 의 특별함
              </Title>
              {/* Button 컴포넌트 적용 */}
              <Button size="lg" className="mt-4">
                button
              </Button>
            </div>
            <div>
              <Text size="lg" CN="text-center">
                BellaDent PREMIUM DENTAL CARE
              </Text>
            </div>
          </RowBox>
        </Container>
        <hr />
        <Container>
          <ImageBox
            images={bg_image_02}
            CCN="w-full mx-auto flex flex-wrap justify-between gap-4 pt-20"
            CN="max-w-[calc((100%-2rem)/3)]"
          />
        </Container>
      </Wrapper>
    </>
  );
}

export default Doctors;
