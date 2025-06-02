import React from 'react';
import { Link } from 'react-router-dom';
import ScrollFadeIn from '../../../../components/web/ScrollFadeIn';

import LineBanner from '../../../../components/web/LineBanner';
import Container from '../../../../components/web/Container';
import Card from '../../../../components/web/Card';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';
import Button from '../../../../components/web/Button';
import RowBox from '../../../../components/web/RowBox';
import ImageBox from '../../../../components/web/ImageBox';

import image_560_680 from '../../../../assets/images/dummy/image_560_680.png';
import image_360_600 from '../../../../assets/images/dummy/image_360_600.png';
import image_360_280 from '../../../../assets/images/dummy/image_360_280.png';

function Doctors() {
  const bg_image_02 = [
    image_360_280,
    image_360_280,
    image_360_280,
    image_360_280,
    image_360_280,
    image_360_280,
  ];
  return (
    <>
      <LineBanner CN="w-full h-40 bg-gray-400 flex flex-col justify-center items-center">
        <Title CN="text-4xl text-center">Welcome to Our Clinic</Title>
        <Text CN="text-xl text-center">Your health is our priority</Text>
      </LineBanner>
      <Container CN="pt-20">
        <ul className="flex justify-center items-center pb-40">
          <li className="w-100 flex justify-center">
            <Link className="py-4 text-xl">의료진1</Link>
          </li>
          <li className="w-100 py-4 text-xl">
            <Link>의료진2</Link>
          </li>
          <li className="w-100 py-4 text-xl">
            <Link>의료진3</Link>
          </li>
        </ul>
        <Card
          image={image_560_680}
          CN="px-5 flex flex-row-reverse justify-between gap-12 pb-120"
        >
          <Title CN="text-4xl text-center">Welcome to Our Clinic</Title>
          <Text CN="text-xl text-center">Your health is our priority</Text>
          <Title CN="text-2xl text-center">Welcome to Our Clinic</Title>
          <Text CN="text-xl text-center">Your health is our priority</Text>
        </Card>
        <ScrollFadeIn delay={0.5}>
          <Title CN="text-4xl text-center pb-10">Welcome to Our Clinic</Title>
        </ScrollFadeIn>
      </Container>
      <LineBanner CN="w-full h-40 bg-gray-400 flex justify-center">
        <div className="w-300 mx-auto flex justify-between items-end px-5">
          <RowBox CN="h-full items-center gap-4">
            <Text CN="text-xl text-center">Your health is our priority</Text>
            <Text CN="text-xl text-center">Your health is our priority</Text>
          </RowBox>
          <img src={image_360_600} alt={image_360_600} />
        </div>
      </LineBanner>
      <Container CN="pt-20 pb-40">
        <hr />
        <RowBox>
          <div>
            <Text CN="text-lg">text</Text>
            <Title CN="text-4xl">title</Title>
            <Button CN="bg-blue-500 text-white w-40 py-4 rounded-2xl text-md mt-4">
              button
            </Button>
          </div>
          <div>
            <Text CN="text-xl text-center">Your health is our priority</Text>
          </div>
        </RowBox>
        <hr />
        <ImageBox
          images={bg_image_02}
          CN="w-full mx-auto flex flex-wrap px-5 justify-between gap-4 pt-20"
        />
      </Container>
    </>
  );
}

export default Doctors;
