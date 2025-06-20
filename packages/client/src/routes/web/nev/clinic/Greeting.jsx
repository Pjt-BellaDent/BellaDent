import React from 'react';
import ScrollFadeIn from '../../../../components/web/ScrollFadeIn';

import LineImageBanner from '../../../../components/web/LineImageBanner';
import Wrapper from '../../../../components/web/Wrapper';
import Container from '../../../../components/web/Container';
import Card from '../../../../components/web/Card';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';
import RowBox from '../../../../components/web/RowBox';

import line_banner from '../../../../assets/images/line_banner.png';
import greeting_sec_1_1 from '../../../../assets/images/greeting_sec_1_1.png';
import greeting_sec_2_1 from '../../../../assets/images/greeting_sec_2_1.png';
import greeting_sec_2_2 from '../../../../assets/images/greeting_sec_2_2.png';

function Greeting() {
  return (
    <>
      <LineImageBanner
        CN="w-full h-40 flex justify-center items-center overflow-hidden"
        image={line_banner}
      >
        <div className="flex flex-col justify-center items-center">
          <Title CN="text-4xl text-center"><b>인사말/병원철학</b> </Title>
          <Text CN="text-xl text-center">Greetings English/Hospital Philosophy</Text>
        </div>
      </LineImageBanner>

      <Wrapper CN="py-40">
        <Container>
          <Text CN="text-xl text-center"> PREMIUM DENTAL CARE</Text>
          <Title CN="text-4xl text-center">BellaDent</Title>
          <img
            src={greeting_sec_1_1}
            alt={greeting_sec_1_1}
            className="w-full h-200 mt-20 object-cover rounded-4xl"
          />
          <ScrollFadeIn delay={0.5}>
            <Title CN="text-4xl py-10">BellaDent 의 특별한 철학</Title>
          </ScrollFadeIn>
          <Text CN="text-xl">환자를 최우선으로 생각하고, 정확한 진단과 꼭 필요한 치료만을 제공하며 치료한다.
 감염 예방을 위한 위생 관리를 철저히 하는 것을 포함합니다.
  </Text>
          <ScrollFadeIn delay={0.5}>
            <Title CN="text-4xl py-10">BellaDent 의 특별한 철학</Title>
          </ScrollFadeIn>
          <Text CN="text-xl">자연 치아를 최대한 살리고, 환자와의 소통을 중시하며 치료한다.
 수준 높은 진료를 제공하는 것을 목표로 합니다.</Text>
          <ScrollFadeIn delay={0.5}>
            <Title CN="text-4xl py-10">BellaDent 의 특별한 철학</Title>
          </ScrollFadeIn>
          <Text CN="text-xl pb-20">치료보다 더 중요한 것은 예방입니다.
바로나는 환자분의 구강 상태에 따른 정기 검진 프로그램을 통해 질병과 노화로부터 구강 건강과 젊음을 지켜나갑니다.</Text>
        </Container>

        <hr />

        <Container>
          <Text CN="text-xl pt-20">BellaDent 
PREMIUM DENTAL CARE</Text>
          <Title CN="text-4xl">인사말</Title>
          <Text CN="mt-6">안녕하세요! BellaDent 입니다. 환자분들의 밝고 건강한 미소를 위해 늘 최선을 다하고 있습니다. 따뜻한 마음으로 정성을 다해 진료하며, 편안하게 치료받으실 수 있도록 언제나 노력하겠습니다. 궁금한 점이 있으시면 언제든지 편하게 문의해주세요!</Text>
          <RowBox CN="justify-between pt-20 gap-10">
            <Card
              CN="flex flex-col items-start max-w-full"
              image={greeting_sec_2_1}
            >
              <ScrollFadeIn delay={0.5}>
                <Title CN="text-4xl py-10">BellaDent 의 특별함</Title>
              </ScrollFadeIn>
              <Text CN="text-xl pb-10">최신 의료 장비와 숙련된 의료진을 바탕으로 정확하고 안전한 진료를 약속드립니다. 개개인에게 최적화된 맞춤형 치료 계획으로 환자분들의 구강 건강을 책임지겠습니다. 믿고 맡길 수 있는 치과, BellaDent 특별함이 되겠습니다.</Text>
            </Card>
            <Card
              CN="flex flex-col-reverse items-start max-w-full"
              image={greeting_sec_2_2}
            >
              <ScrollFadeIn delay={0.5}>
                <Title CN="text-4xl py-10"> 홈페이지/SNS </Title>
              </ScrollFadeIn>
              <Text CN="text-xl pe-20">BellaDent은 환자분들의 아름다운 미소와 건강한 구강을 위해 다양한 진료 정보를 제공하고 있습니다. 궁금한 점은 언제든 문의해주시고, 온라인 예약도 가능하니 많은 이용 바랍니다!</Text>
            </Card>
          </RowBox>
        </Container>
      </Wrapper>
    </>
  );
}

export default Greeting;
