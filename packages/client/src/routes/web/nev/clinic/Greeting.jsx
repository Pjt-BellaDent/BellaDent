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
          <Title CN="text-4xl text-center">Welcome to Our Clinic</Title>
          <Text CN="text-xl text-center">Your health is our priority</Text>
        </div>
      </LineImageBanner>

      <Wrapper CN="py-40">
        <Container>
          <Text CN="text-xl text-center">Your health is our priority</Text>
          <Title CN="text-4xl text-center">Welcome to Our Clinic</Title>
          <img
            src={greeting_sec_1_1}
            alt={greeting_sec_1_1}
            className="w-full h-200 mt-20 object-cover rounded-4xl"
          />
          <ScrollFadeIn delay={0.5}>
            <Title CN="text-4xl py-10">Welcome to Our Clinic</Title>
          </ScrollFadeIn>
          <Text CN="text-xl">Your health is our priority</Text>
          <ScrollFadeIn delay={0.5}>
            <Title CN="text-4xl py-10">Welcome to Our Clinic</Title>
          </ScrollFadeIn>
          <Text CN="text-xl">Your health is our priority</Text>
          <ScrollFadeIn delay={0.5}>
            <Title CN="text-4xl py-10">Welcome to Our Clinic</Title>
          </ScrollFadeIn>
          <Text CN="text-xl pb-20">Your health is our priority</Text>
        </Container>

        <hr />

        <Container>
          <Text CN="text-xl pt-20">Your health is our priority</Text>
          <Title CN="text-4xl">Welcome to Our Clinic</Title>
          <RowBox CN="justify-between pt-20 gap-10">
            <Card
              CN="flex flex-col items-start max-w-full"
              image={greeting_sec_2_1}
            >
              <ScrollFadeIn delay={0.5}>
                <Title CN="text-4xl py-10">Welcome to Our Clinic</Title>
              </ScrollFadeIn>
              <Text CN="text-xl pb-10">Your health is our priority</Text>
            </Card>
            <Card
              CN="flex flex-col-reverse items-start max-w-full"
              image={greeting_sec_2_2}
            >
              <ScrollFadeIn delay={0.5}>
                <Title CN="text-4xl py-10">Welcome to Our Clinic</Title>
              </ScrollFadeIn>
              <Text CN="text-xl pe-20">Your health is our priority</Text>
            </Card>
          </RowBox>
        </Container>
      </Wrapper>
    </>
  );
}

export default Greeting;
