import react from 'react';
import ScrollFadeIn from '../../components/web/ScrollFadeIn';
import { useHospitalInfo } from '../../contexts/HospitalContext';

import Carousel from '../../components/web/Carousel';
import LineBanner from '../../components/web/LineBanner';
import Wrapper from '../../components/web/Wrapper';
import Container from '../../components/web/Container';
import Card from '../../components/web/Card';
import Title from '../../components/web/Title';
import Text from '../../components/web/Text';
import Button from '../../components/web/Button';
import CarouselCardList from '../../components/web/CarouselCardList';
import ScrollBgBox from '../../components/web/ScrollBgBox';
import RowBox from '../../components/web/RowBox';
import ImageBox from '../../components/web/ImageBox';
import CardCarousel from '../../components/web/CardCarousel';
import Map from '../../components/web/Map';

import carousel_01 from '../../assets/images/carousel_01.png';
import carousel_02 from '../../assets/images/carousel_02.png';
import carousel_03 from '../../assets/images/carousel_03.png';
import home_sec_1_1 from '../../assets/images/home_sec_1_1.png';
import home_sec_1_2 from '../../assets/images/home_sec_1_2.png';
import home_sec_2_1 from '../../assets/images/home_sec_2_1.png';
import home_sec_2_2 from '../../assets/images/home_sec_2_2.png';
import home_sec_2_3 from '../../assets/images/home_sec_2_3.png';
import home_sec_2_4 from '../../assets/images/home_sec_2_4.png';
import home_sec_2_5 from '../../assets/images/home_sec_2_5.png';
import home_sec_2_6 from '../../assets/images/home_sec_2_6.png';
import home_bg_1 from '../../assets/images/home_bg_1.png';
import home_sec_3_1 from '../../assets/images/home_sec_3_1.png';
import home_sec_3_2 from '../../assets/images/home_sec_3_2.png';
import home_sec_3_3 from '../../assets/images/home_sec_3_3.png';
import home_bg_2 from '../../assets/images/home_bg_2.png';
import home_sec_4_1 from '../../assets/images/home_sec_4_1.png';
import home_bg_3 from '../../assets/images/home_bg_3.png';
import home_sec_5_1 from '../../assets/images/home_sec_5_1.png';
import home_bg_4 from '../../assets/images/home_bg_4.png';
import home_sec_6_1 from '../../assets/images/home_sec_6_1.png';
import home_sec_6_2 from '../../assets/images/home_sec_6_2.png';
import home_sec_6_3 from '../../assets/images/home_sec_6_3.png';
import home_sec_6_4 from '../../assets/images/home_sec_6_4.png';
import home_sec_7_1 from '../../assets/images/home_sec_7_1.png';
import home_sec_7_2 from '../../assets/images/home_sec_7_2.png';
import home_sec_7_3 from '../../assets/images/home_sec_7_3.png';
import home_sec_7_4 from '../../assets/images/home_sec_7_4.png';
import home_sec_7_5 from '../../assets/images/home_sec_7_5.png';
import home_sec_7_6 from '../../assets/images/home_sec_7_6.png';
import home_sec_7_7 from '../../assets/images/home_sec_7_7.png';
import home_sec_7_8 from '../../assets/images/home_sec_7_8.png';

function Home() {
  const carousel1Images = [carousel_01, carousel_02, carousel_03];
  const imagesBox_1 = [
    home_sec_2_1,
    home_sec_2_2,
    home_sec_2_3,
    home_sec_2_4,
    home_sec_2_5,
    home_sec_2_6,
  ];
  const imagesBox_2 = [home_sec_6_1, home_sec_6_2, home_sec_6_3, home_sec_6_4];
  const imagesBox_3 = [
    home_sec_7_1,
    home_sec_7_2,
    home_sec_7_3,
    home_sec_7_4,
    home_sec_7_5,
    home_sec_7_6,
    home_sec_7_7,
    home_sec_7_8,
  ];

  const { hospitalInfo } = useHospitalInfo();
  const storeMarkers = [
    {
      id: 'store',
      latitude: 37.5665,
      longitude: 126.978,
      storeName: hospitalInfo.name,
      contact: hospitalInfo.phone,
    },
  ];


  return (
    <>
      <Carousel images={carousel1Images} CN={'max-h-full'} />

      <LineBanner CN="w-full h-40 bg-BD-CharcoalBlack flex justify-center items-center">
        <Title CN="text-4xl text-BD-ElegantGold">Premium Dental Care</Title>
      </LineBanner>

      <Wrapper CN="py-40">
        <Container>
          <Card
            image={home_sec_1_1}
            CN="mx-auto flex flex-row justify-between gap-12"
          >
            <ScrollFadeIn delay={0.3}>
              <Title CN="text-4xl">title</Title>
            </ScrollFadeIn>
            <Text CN="text-lg">text</Text>
            <Button CN="bg-BD-CharcoalBlack text-BD-ElegantGold w-40 py-4 rounded-2xl text-md mt-4">
              button
            </Button>
          </Card>
          <Card
            image={home_sec_1_2}
            CN="mx-auto flex flex-row-reverse justify-end gap-12 py-20"
          >
            <ScrollFadeIn delay={0.3}>
              <Title CN="text-4xl">title</Title>
            </ScrollFadeIn>
            <Text CN="text-lg">text</Text>
            <Button CN="bg-BD-CharcoalBlack text-BD-ElegantGold w-40 py-4 rounded-2xl text-md mt-4">
              button
            </Button>
          </Card>
        </Container>

        <hr />

        <Container>
          <CarouselCardList
            cards={imagesBox_1}
            containerWidth="1280"
            containerHeight="600"
            CN="my-20"
          />
        </Container>

        <hr />
      </Wrapper>

      <ScrollBgBox CN={`w-full h-220 bg-cover bg-fixed`} url={home_bg_1} />

      <Container CN="text-center py-40">
        <Title CN="text-6xl">Title</Title>
        <Text CN="text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>

        <RowBox CN="justify-center gap-20 pt-20">
          <Card
            Scroll={true}
            image={home_sec_3_1}
            CN="flex flex-col-reverse items-center gap-4 pt-15"
          >
            <Title CN="text-4xl">title</Title>
            <Text CN="text-lg">text</Text>
          </Card>
          <Card
            Scroll={true}
            image={home_sec_3_2}
            CN="flex flex-col-reverse items-center gap-4"
          >
            <Title CN="text-4xl">title</Title>
            <Text CN="text-lg">text</Text>
          </Card>
          <Card
            Scroll={true}
            image={home_sec_3_3}
            CN="flex flex-col-reverse items-center gap-4 pt-30"
          >
            <Title CN="text-4xl">title</Title>
            <Text CN="text-lg">text</Text>
          </Card>
        </RowBox>
      </Container>

      <ScrollBgBox
        CN="w-full h-300 flex flex-col items-end justify-center pe-90 bg-cover bg-fixed"
        url={home_bg_2}
      >
        <ScrollFadeIn delay={0.2}>
          <Title CN="text-right text-2xl">title</Title>
        </ScrollFadeIn>
        <Text CN="text-right">text</Text>
      </ScrollBgBox>

      <Container CN="py-40">
        <Card
          image={home_sec_4_1}
          CN="mx-auto flex flex-row-reverse justify-end gap-12"
        >
          <ScrollFadeIn delay={0.3}>
            <Title CN="text-4xl">title</Title>
          </ScrollFadeIn>
          <Text CN="text-lg">text</Text>
          <Button CN="bg-BD-CharcoalBlack text-BD-ElegantGold w-40 py-4 rounded-2xl text-md mt-4">
            button
          </Button>
        </Card>
      </Container>

      <ScrollBgBox
        CN="w-full h-300 flex flex-col items-end justify-center pe-90 bg-cover bg-fixed"
        url={home_bg_3}
      >
        <ScrollFadeIn delay={0.2}>
          <Title CN="text-right text-2xl">title</Title>
        </ScrollFadeIn>
        <Text CN="text-right">text</Text>
      </ScrollBgBox>

      <Wrapper CN="py-40">
        <Container>
          <Card
            image={home_sec_5_1}
            CN="mx-auto flex flex-row justify-between gap-12 pb-20"
          >
            <ScrollFadeIn delay={0.3}>
              <Title CN="text-4xl">title</Title>
            </ScrollFadeIn>
            <Text CN="text-lg">text</Text>
            <Button CN="bg-BD-CharcoalBlack text-BD-ElegantGold w-40 py-4 rounded-2xl text-md mt-4">
              button
            </Button>
          </Card>
        </Container>

        <hr />

        <Container>
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
        </Container>

        <hr />
      </Wrapper>

      <ScrollBgBox
        CN="w-full h-300 flex flex-col items-end justify-center pe-90 bg-cover bg-fixed"
        url={home_bg_4}
      >
        <ScrollFadeIn delay={0.2}>
          <Title CN="text-right text-2xl">title</Title>
        </ScrollFadeIn>
        <Text CN="text-right">text</Text>
        <Button CN="bg-BD-CharcoalBlack text-BD-ElegantGold w-40 py-4 rounded-2xl text-md mt-4">
          button
        </Button>
      </ScrollBgBox>

      <Wrapper CN="py-40">
        <Container>
          <CardCarousel
            images={imagesBox_2}
            CCN="mx-auto flex flex-row justify-between gap-12 mb-20"
          >
            <ScrollFadeIn delay={0.3}>
              <Title CN="text-4xl">title</Title>
            </ScrollFadeIn>
            <Text CN="text-lg">text</Text>
            <Button CN="bg-BD-CharcoalBlack text-BD-ElegantGold w-40 py-4 rounded-2xl text-md mt-4">
              button
            </Button>
          </CardCarousel>
        </Container>

        <hr />

        <Container>
          <Title CN="px-5 text-4xl text-center mt-20">title</Title>
          <Text CN="px-5 text-center">text</Text>
          <ImageBox
            images={imagesBox_3}
            CCN="w-full mx-auto flex flex-wrap justify-between gap-4 pt-20"
            CN="max-w-[calc((100%-3rem)/4)]"
          />
        </Container>
      </Wrapper>

      <LineBanner CN="w-full h-40 bg-BD-CharcoalBlack flex">
        <Container CN="flex justify-between items-start mt-15">
          <div className="flex flex-row items-end gap-4 text-BD-ElegantGold">
            <Title CN="text-4xl">banner</Title>
            <Text CN="">text</Text>
          </div>
          <div className="flex flex-col gap-4 p-12 bg-BD-ElegantGold text-BD-CharcoalBlack z-10">
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

      <div className="w-full h-130">
        <Map
          markersData={storeMarkers}
          zoom={17}
          address={hospitalInfo.address}
        />
      </div>
    </>
  );
}

export default Home;
