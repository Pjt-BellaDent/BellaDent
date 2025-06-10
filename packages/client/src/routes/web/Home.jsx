import react from 'react';
import ScrollFadeIn from '../../components/web/ScrollFadeIn';

import Carousel from '../../components/web/Carousel';
import LineBanner from '../../components/web/LineBanner';
import Container from '../../components/web/Container';
import Card from '../../components/web/Card';
import Title from '../../components/web/Title';
import Text from '../../components/web/Text';
import Button from '../../components/web/Button';
import CarouselCardList from '../../components/web/CarouselCardList';
import ScrollBgBox from '../../components/web/ScrollBgBox';
import RowBox from '../../components/web/RowBox';
import ImageBox from '../../components/web/ImageBox';

import carousel_01 from '../../assets/images/dummy/carousel_01.png';
import carousel_02 from '../../assets/images/dummy/carousel_02.png';
import carousel_03 from '../../assets/images/dummy/carousel_03.png';
import image_380_520 from '../../assets/images/dummy/image_380_520.png';
import image_560_400 from '../../assets/images/dummy/image_560_400.png';
import image_240_240 from '../../assets/images/dummy/image_240_240.png';
import image_240_320 from '../../assets/images/dummy/image_240_320.png';
import image_280_210 from '../../assets/images/dummy/image_280_210.png';
import bg_image_01 from '../../assets/images/dummy/bg_image_01.png';
import bg_image_02 from '../../assets/images/dummy/bg_image_02.png';
import bg_image_03 from '../../assets/images/dummy/bg_image_03.png';

function Home() {
  const carousel1Images = [carousel_01, carousel_02, carousel_03];
  const imagesBox_1 = [
    image_380_520,
    image_380_520,
    image_380_520,
    image_380_520,
    image_380_520,
    image_380_520,
    image_380_520,
    image_380_520,
  ];
  const imagesBox_2 = [
    image_280_210,
    image_280_210,
    image_280_210,
    image_280_210,
    image_280_210,
    image_280_210,
    image_280_210,
    image_280_210,
  ];

  return (
    <>
      <Carousel images={carousel1Images} />
      <LineBanner CN="w-full h-40 bg-gray-400 flex justify-center items-center">
        <Title CN="text-2xl">banner</Title>
      </LineBanner>
      <Container CN="py-40">
        <Card
          image={image_560_400}
          CN="max-w-300 mx-auto px-5 flex flex-row justify-between gap-12"
        >
          <ScrollFadeIn delay={0.3}>
            <Title CN="text-4xl">title</Title>
          </ScrollFadeIn>
          <Text CN="text-lg">text</Text>
          <Button CN="bg-blue-500 text-white w-40 py-4 rounded-2xl text-md mt-4">
            button
          </Button>
        </Card>
        <Card
          image={image_560_400}
          CN="max-w-300 mx-auto px-5 flex flex-row-reverse justify-end gap-12 py-20"
        >
          <ScrollFadeIn delay={0.3}>
            <Title CN="text-4xl">title</Title>
          </ScrollFadeIn>
          <Text CN="text-lg">text</Text>
          <Button CN="bg-blue-500 text-white w-40 py-4 rounded-2xl text-md mt-4">
            button
          </Button>
        </Card>
        <hr />
        <CarouselCardList
          cards={imagesBox_1}
          containerWidth="1160"
          CN="py-20"
        />
        <hr />
      </Container>
      <ScrollBgBox CN="w-full h-220 bg-cover bg-scroll" url={bg_image_01} />
      <Container CN="text-center py-40">
        <Title CN="text-6xl">Title</Title>
        <Text CN="text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
        <RowBox CN="justify-center gap-10 pt-20">
          <Card
            Scroll={true}
            image={image_240_240}
            CN="max-w-80 px-5 flex flex-col-reverse items-center gap-4 pb-15"
          >
            <Title CN="text-4xl">title</Title>
            <Text CN="text-lg">text</Text>
          </Card>
          <Card
            Scroll={true}
            image={image_240_320}
            CN="max-w-80 px-5 flex flex-col-reverse items-center gap-4 pb-30"
          >
            <Title CN="text-4xl">title</Title>
            <Text CN="text-lg">text</Text>
          </Card>
          <Card
            Scroll={true}
            image={image_240_320}
            CN="max-w-80 px-5 flex flex-col-reverse items-center gap-4"
          >
            <Title CN="text-4xl">title</Title>
            <Text CN="text-lg">text</Text>
          </Card>
        </RowBox>
      </Container>
      <ScrollBgBox
        CN="w-full h-255 flex flex-col items-end justify-center pe-90 bg-cover bg-scroll"
        url={bg_image_02}
      >
        <ScrollFadeIn delay={0.2}>
          <Title CN="text-right text-2xl">title</Title>
        </ScrollFadeIn>
        <Text CN="text-right">text</Text>
      </ScrollBgBox>
      <Container CN="py-40">
        <Card
          image={image_560_400}
          CN="max-w-300 mx-auto px-5 flex flex-row-reverse justify-end gap-12"
        >
          <ScrollFadeIn delay={0.3}>
            <Title CN="text-4xl">title</Title>
          </ScrollFadeIn>
          <Text CN="text-lg">text</Text>
          <Button CN="bg-blue-500 text-white w-40 py-4 rounded-2xl text-md mt-4">
            button
          </Button>
        </Card>
      </Container>
      <ScrollBgBox CN="w-full h-255 flex flex-col items-end justify-center pe-90 bg-cover bg-scroll" url={bg_image_03}>
        <ScrollFadeIn delay={0.2}>
          <Title CN="text-right text-2xl">title</Title>
        </ScrollFadeIn>
        <Text CN="text-right">text</Text>
      </ScrollBgBox>
      <Container CN="py-40">
        <Card
          image={image_560_400}
          CN="max-w-300 mx-auto px-5 flex flex-row justify-between gap-12 pb-20"
        >
          <ScrollFadeIn delay={0.3}>
            <Title CN="text-4xl">title</Title>
          </ScrollFadeIn>
          <Text CN="text-lg">text</Text>
          <Button CN="bg-blue-500 text-white w-40 py-4 rounded-2xl text-md mt-4">
            button
          </Button>
        </Card>
        <hr />
        <div className="px-5 py-20">
          <Text>text</Text>
          <Title CN="text-4xl">title</Title>
          <Text CN="mt-6">text</Text>
          <Text>text</Text>
          <Text CN="mt-6">text</Text>
          <Text>text</Text>
          <Text CN="mt-6">text</Text>
          <Text CN="mt-6">text</Text>
        </div>
        <hr />
      </Container>
      <ScrollBgBox CN="w-full h-400 flex flex-col items-end justify-center pe-90 bg-cover bg-scroll" url={bg_image_01}>
        <ScrollFadeIn delay={0.2}>
          <Title CN="text-right text-2xl">title</Title>
        </ScrollFadeIn>
        <Text CN="text-right">text</Text>
        <Button CN="bg-blue-500 text-white w-40 py-4 rounded-2xl text-md mt-4">
          button
        </Button>
      </ScrollBgBox>
      <Container CN="py-40">
        <Card
          image={image_560_400}
          CN="max-w-300 mx-auto px-5 flex flex-row justify-between gap-12 mb-20"
        >
          <ScrollFadeIn delay={0.3}>
            <Title CN="text-4xl">title</Title>
          </ScrollFadeIn>
          <Text CN="text-lg">text</Text>
          <Button CN="bg-blue-500 text-white w-40 py-4 rounded-2xl text-md mt-4">
            button
          </Button>
        </Card>
        <hr />
        <Title CN="px-5 text-4xl text-center mt-20">title</Title>
        <Text CN="px-5 text-center">text</Text>
        <ImageBox
          images={imagesBox_2}
          CN="w-full mx-auto flex flex-wrap px-5 justify-between gap-3 pt-20"
        />
      </Container>
      <LineBanner CN="w-full h-40 bg-gray-400 flex">
        <Container CN="w-300 flex justify-between items-start px-5 mt-15">
          <div className="flex flex-row items-end gap-4 px-5 mt-">
            <Title CN="text-4xl">banner</Title>
            <Text CN="">text</Text>
          </div>
          <div className="flex flex-col gap-4 p-12 bg-yellow-500/50">
            <Title CN="text-4xl">banner</Title>
            <Text CN="">text</Text>
            <Text CN="mt-4">text</Text>
            <Text CN="">text</Text>
            <Text CN="">text</Text>
            <Text CN="">text</Text>
            <Text CN="">text</Text>
          </div>
        </Container>
      </LineBanner>
      <ScrollBgBox CN="w-full h-130 bg-cover bg-scroll" url={bg_image_02} />
    </>
  );
}

export default Home;
