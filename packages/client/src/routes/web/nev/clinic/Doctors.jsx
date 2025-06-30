import React, { useState } from 'react';
import ScrollFadeIn from '../../../../components/web/ScrollFadeIn';

import LineImageBanner from '../../../../components/web/LineImageBanner';
import LineBanner from '../../../../components/web/LineBanner';
import Wrapper from '../../../../components/web/Wrapper';
import Container from '../../../../components/web/Container';
import Card from '../../../../components/web/Card';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';
import Button from '../../../../components/web/Button';
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
import line_banner from '../../../../assets/images/line_banner.png';

function Doctors() {
  const [activeTab, setActiveTab] = useState('jungHaNeul'); // 초기값 변경: 정하늘 대표원장

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

  // 의료진 정보 객체 (사진 경로 및 텍스트 포함)
  const doctorsInfo = {
    jungHaNeul: {
      name: '정하늘 대표원장',
      specialty: '심미치료 (라미네이트, 잇몸성형, 세라믹보철)',
      description: `BellaDent 을 찾아주셔서 감사합니다. 대표원장 정하늘입니다. 저는 라미네이트, 잇몸성형, 세라믹 보철 등 심미치료 분야에 대한 깊은 연구와 풍부한 임상 경험을 바탕으로 진료합니다. 단순히 보기 좋은 치아를 넘어, 환자분의 얼굴과 조화를 이루는 개개인 맞춤형 디자인을 추구하며, 진료 과정의 모든 순간을 사진 기록으로 꼼꼼히 관리하여 신뢰할 수 있는 결과를 약속드립니다. BellaDent 에서 당신의 완벽한 미소를 경험하세요.`,
      additionalInfo: ``,
      cardImage: doctor_1_sec_1_1,
      bannerImage: doctor_1_sec_1_2,
    },
    kimSuMin: {
      name: '김수민 부원장',
      specialty: '교정 + 미백',
      description: `안녕하세요, BellaDent 부원장 김수민입니다. 저는 교정과 미백을 통해 숨겨진 당신의 아름다운 미소를 찾아드리는 데 집중합니다. 환자분들과 깊은 라포 형성을 통해 진심으로 소통하고, 걱정 없는 진료 과정을 만들어 드리려 노력하고 있어요. 진료 전후의 확실한 변화를 사진과 영상으로 기록하여 직접 보여드리며, SNS를 통해 여러분의 빛나는 후기를 직접 보고 싶어요. BellaDent 에서 당신의 삶을 변화시킬 아름다운 미소를 만나보세요!`,
      additionalInfo: ``, // 추가 정보가 없다면 비워두거나 다른 값
      cardImage: doctor_2_sec_1_1,
      bannerImage: doctor_2_sec_1_2,
    },
    parkJungWoo: {
      name: '박정우 과장',
      specialty: '일반 진료 + 보철',
      description: `안녕하세요, 환자분의 구강 건강을 꼼꼼하게 관리하는 BellaDent 과장 박정우입니다. 저는 일반 진료와 보철 분야에서, 환자분들이 불편함 없이 오래 사용할 수 있는 실용적인 치료를 중요하게 생각합니다. 한번 진료로 끝이 아니라, 정기적인 검진과 철저한 사후 관리를 통해 환자분들의 치아가 오랫동안 건강하게 유지될 수 있도록 최선을 다하겠습니다. 믿고 맡길 수 있는 진료로 편안한 미소를 찾아드리겠습니다.`,
      additionalInfo: ``, // 추가 정보가 없다면 비워두거나 다른 값
      cardImage: doctor_3_sec_1_1,
      bannerImage: doctor_3_sec_1_2,
    },
  };

  const currentDoctor = doctorsInfo[activeTab];

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
          의료진 소개
        </Title>
        <Text size="md" CN="text-center">
          Medical staff introduction
        </Text>
      </LineImageBanner>

      <Container CN="pt-20">
        <ul className="flex justify-center items-center pb-40 divide-x-2">
          <li
            className={`w-80 py-2 text-xl text-center cursor-pointer ${
              activeTab === 'jungHaNeul'
                ? 'text-bd-elegant-gold font-bold'
                : 'text-bd-charcoal-black'
            }`}
            onClick={() => setActiveTab('jungHaNeul')}
          >
            정하늘 대표원장
          </li>
          <li
            className={`w-80 py-2 text-xl text-center cursor-pointer ${
              activeTab === 'kimSuMin'
                ? 'text-bd-elegant-gold font-bold'
                : 'text-bd-charcoal-black'
            }`}
            onClick={() => setActiveTab('kimSuMin')}
          >
            김수민 부원장
          </li>
          <li
            className={`w-80 py-2 text-xl text-center cursor-pointer ${
              activeTab === 'parkJungWoo'
                ? 'text-bd-elegant-gold font-bold'
                : 'text-bd-charcoal-black'
            }`}
            onClick={() => setActiveTab('parkJungWoo')}
          >
            박정우 과장
          </li>
        </ul>

        <Card
          image={currentDoctor.cardImage}
          CN="px-5 flex flex-row-reverse justify-between gap-12 pb-120"
        >
          <Title as="h2" size="lg" CN="text-center">
            {currentDoctor.name}
          </Title>
          <Text size="lg" CN="mt-6 text-center">
            전문 분야: {currentDoctor.specialty}
          </Text>
          <Text as="h3" size="lg" CN="mt-6 text-center">
            {currentDoctor.description}
          </Text>
          {currentDoctor.additionalInfo && (
            <Text size="lg" CN="mt-6 text-center whitespace-pre-wrap">
              {currentDoctor.additionalInfo}
            </Text>
          )}
        </Card>
        <ScrollFadeIn delay={0.5}>
          <Title as="h2" size="lg" CN="text-center pb-10">
            Welcome to Our Clinic
          </Title>
        </ScrollFadeIn>
      </Container>

      <LineBanner CN="w-full h-40 bg-bd-cool-gray flex justify-center">
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
              src={currentDoctor.bannerImage}
              alt={currentDoctor.name}
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
              <Button size="lg" variant="positive" className="mt-4">
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
