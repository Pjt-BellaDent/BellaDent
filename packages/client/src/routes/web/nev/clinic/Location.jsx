import React from 'react';

import LineBanner from '../../../../components/web/LineBanner';
import Container from '../../../../components/web/Container';
import Card from '../../../../components/web/Card';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';


import image_560_720 from '../../../../assets/images/dummy/image_560_720.png';


function location() {
  return (
    <>
      <LineBanner CN="w-full h-40 bg-gray-400 flex flex-col justify-center items-center">
        <Title CN="text-4xl text-center">Welcome to Our Clinic</Title>
        <Text CN="text-xl text-center">Your health is our priority</Text>
      </LineBanner>
      <Container CN="py-40">
        <Card
          image={image_560_720}
          CN="px-5 flex flex-row justify-between gap-12"
        >
          <div className='border p-4 mb-10'>
            <Title CN="text-6xl">Welcome to Our Clinic</Title>
            <Title CN="text-4xl">Welcome to Our Clinic</Title>
            <Text CN="text-xl">Your health is our priority</Text>
          </div>

          <Title CN="text-4xl">Welcome to Our Clinic</Title>
          <hr className="my-6" />
          <Title CN="text-4xl">Welcome to Our Clinic</Title>
          <hr className="my-6" />
          <Title CN="text-4xl">Welcome to Our Clinic</Title>
          <Text CN="text-xl">Your health is our priority</Text>
        </Card>
      </Container>
    </>
  );
}

export default location;
