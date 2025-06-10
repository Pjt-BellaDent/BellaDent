import React from 'react';
import ScrollFadeIn from '../../../../components/web/ScrollFadeIn';

import LineBanner from '../../../../components/web/LineBanner';
import Container from '../../../../components/web/Container';
import Card from '../../../../components/web/Card';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';
import RowBox from '../../../../components/web/RowBox';

import bg_image_01 from '../../../../assets/images/dummy/bg_image_01.png';
import image_560_400 from '../../../../assets/images/dummy/image_560_400.png';

function Greeting() {
  return (
    <>
      <LineBanner CN="w-full h-40 bg-gray-400 flex flex-col justify-center items-center">
        <Title CN="text-4xl text-center">Welcome to Our Clinic</Title>
        <Text CN="text-xl text-center">Your health is our priority</Text>
      </LineBanner>
      <Container CN="py-40">
        <Text CN="text-xl text-center">Your health is our priority</Text>
        <Title CN="text-4xl text-center">Welcome to Our Clinic</Title>
        <img
          src={bg_image_01}
          alt={bg_image_01}
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
        <hr />
        <Text CN="text-xl pt-20">Your health is our priority</Text>
        <Title CN="text-4xl">Welcome to Our Clinic</Title>
        <RowBox CN="justify-between pt-20">
          <Card
            CN="flex flex-col items-start max-w-full"
            image={image_560_400}
          >
            <ScrollFadeIn delay={0.5}>
              <Title CN="text-4xl py-10">
                Welcome to Our Clinic
              </Title>
            </ScrollFadeIn>
            <Text CN="text-xl pb-10">
              Your health is our priority
            </Text>
          </Card>
          <Card
            CN="flex flex-col-reverse items-start max-w-full"
            image={image_560_400}
          >
            <ScrollFadeIn delay={0.5}>
              <Title CN="text-4xl py-10">
                Welcome to Our Clinic
              </Title>
            </ScrollFadeIn>
            <Text CN="text-xl pe-20">
              Your health is our priority
            </Text>
          </Card>
        </RowBox>
      </Container>
    </>
  );
}

export default Greeting;
