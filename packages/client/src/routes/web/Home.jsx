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
              <Title CN="text-4xl">BellaDent 치과</Title>
            </ScrollFadeIn>
            <Text CN="text-lg">
              하얀치아 예쁜미소!!! 충치치료 치아교정 앞으로도 의료계와의 소통을
              통해 정확하고 신뢰받는 심사를 바탕으로 안전하고 수준 높은 적정진료
              등으로 우리의 건강과 아름다운 치아로 건강한 치아로 하얀치아와
              미소로 우리의 행복한 삶을 만들어 새로운 미래를 함께 합니다
            </Text>
            <Button CN="bg-BD-CharcoalBlack text-BD-ElegantGold w-40 py-4 rounded-2xl text-md mt-4">
              button
            </Button>
          </Card>
          <Card
            image={home_sec_1_2}
            CN="mx-auto flex flex-row-reverse justify-end gap-12 py-20"
          >
            <ScrollFadeIn delay={0.3}>
              <Title CN="text-4xl">BellaDent 장점</Title>
            </ScrollFadeIn>
            <Text CN="text-lg">
              사실 임플란트(implant)라는 말은 해당 치과치료에만 국한되는 말은
              아니고, 인체 내부에다 심어 넣는다는 뜻이다. 일반적으로 의학계에서
              쓰일 때는 뭔가를 인체에 매입하는 수술, 즉 장기나 인공장기 등을
              몸에 넣는 수술(흔히 말해 '이식(移植)수술') 등을 총칭하는 말이다.
              실제로, 영어에서는 구분을 위해 Dental implant라고 부르며, 본
              치아를 대체하기 위하여 티타늄으로 만들어진 보철물의 일종을 심기
              때문에 implant 시술로 부르는 것이다. 한국에서는 아무래도 어감에선
              이런 게 다가오지 않다보니 '임플란트'의 의미 자체가 인공치아 시술을
              잘하는 전문 병원으로 장점이 있습니다.
            </Text>
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
        <Title CN="text-6xl">진료과정</Title>
        <Text CN="text-lg"></Text>

        <RowBox CN="justify-center gap-20 pt-20">
          <Card
            Scroll={true}
            image={home_sec_3_1}
            CN="flex flex-col-reverse items-center gap-4 pt-15"
          >
            <Title CN="text-4xl">충치치료</Title>

            <Text CN="text-lg">
              치과의 치료법 중 하나로, 충치나 풍치 치료의 최후처방인 발치 이후
              치료법 중 하나이다. 어렵게 충치 치료를 결심했는데 없던 통증이
              생겼다면 환자로서는 고통스러울 수밖에 없다. 치료를 또 해야 해서
              치과 의료 분쟁의 주요 원인이 되기도 한다. “충치 치료 후 통증 발생
              가능성에 대해 미리 환자에게 충분히 설명을 해야 한다”며 “애초에
              신경 치료를 하면 통증 발생 가능성은 없겠지만, 신경 등 자연치아는
              최대한 보존하는 것이 좋다”고 할수 있으며 증상 호전이 없는 경우,
              자극이 없는 데도 통증이 발생하는 등 증상이 악화되는 경우에는
              치수염의 가능성을 염두에 두고 신경 치료를 진행해야 한다.
            </Text>
          </Card>
          <Card
            Scroll={true}
            image={home_sec_3_2}
            CN="flex flex-col-reverse items-center gap-4"
          >
            <Title CN="text-4xl">임플란트</Title>

            <Text CN="text-lg">
              수술 시간은 보통 15분에서 한 시간 반 가량 되는데 수술의 범위,
              임플란트 개수, 치조골 이식의 동반 여부에 따라 길어질 수도 있다.
              여기에서 수술 시간이 짧으면 달인이라 생각할 수도 있지만, 대충 하는
              경우도 있단 걸 기억해두자. 단순 임플란트가 아니라 치조골 이식을
              동반하거나 여러 개를 심는 경우인데 너무 금방 끝났다면 합리적
              의심을 해볼 수도 있으나 사실 그 정도로 양심 없는 치과의사는
              극소수다. 행여 시간이 오래 걸렸다면 이 양반이 꼼꼼하게 하려고
              하는구나 생각하면 된다. 임플란트는 그것을 심는 순간부터 죽을
              때까지 한 사람과 평생을 함께하게 될 인공물이므로, 의식적으로
              그것에 익숙해지고 자연스러워지는 적응기간을 갖게 된다
            </Text>
          </Card>
          <Card
            Scroll={true}
            image={home_sec_3_3}
            CN="flex flex-col-reverse items-center gap-4 pt-30"
          >
            <Title CN="text-4xl">건강한 치아</Title>

            <Text CN="text-lg">
              어렵게 충치 치료를 결심했는데 없던 통증이 생겼다면 환자로서는
              고통스러울 수밖에 없다. 치료를 또 해야 해서 치과 의료 분쟁의 주요
              원인이 되기도 한다. “애초에 신경 치료를 하면 통증 발생 가능성은
              없겠지만, 신경 등 자연치아는 최대한 보존하는 것이 좋다”고 말했다.
              최근 밝혀진 바에 따르면 치아 신경의 ‘역할’은 생각보다 크다. 온도
              자극을 느끼는 것 뿐만 아니라 고유 수용 감각이 있어 저작 기능이 잘
              이뤄질 수 있도록 돕는다. “애초에 신경 치료를 하면 통증 발생
              가능성은 없겠지만, 신경 등 자연치아는 최대한 보존하는 것이 좋다”고
              말했다. 최근 밝혀진 바에 따르면 치아 신경의 ‘역할’은 생각보다
              크다. 온도 자극을 느끼는 것 뿐만 아니라 고유 수용 감각이 있어 저작
              기능이 잘 이뤄질 수 있도록 돕는다.
            </Text>
          </Card>
        </RowBox>
      </Container>

      <ScrollBgBox
        CN="w-full h-300 flex flex-col items-end justify-center pe-90 bg-cover bg-fixed"
        url={home_bg_2}
      >
        <ScrollFadeIn delay={0.2}>
          <Title CN="text-right text-2xl">BellaDent</Title>
        </ScrollFadeIn>
        <Text CN="text-right">PREMIUM DENTAL CARE</Text>
      </ScrollBgBox>

      <Container CN="py-40">
        <Card
          image={home_sec_4_1}
          CN="mx-auto flex flex-row-reverse justify-end gap-12"
        >
          <ScrollFadeIn delay={0.3}>
            <Title CN="text-4xl">치아 엑스레이</Title>
          </ScrollFadeIn>
          <Text CN="text-lg">
            "치아교정치료 목적으로 촬영한 저선량 엑스레이 영상 검사로 뇌,
            안면부의 심각한 질환을 무증상 상태에서 조기 발견이 가능했다는 점에
            주목해야 한다"면서 ”이를 통해 치과적 문제점 외에도 의학적 질환
            진단에 도움이 됐고 신속한 진료 연계로 그 치료성적 또한 우수했음을
            증명했기에 치아 상태 연구라고 평가하여 연구하고 설명을 하여 치아상태
            여러 가지 설명으로 밝혔다.
          </Text>
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
          <Title CN="text-right text-2xl">
            BellaDent 는 아침 8시 30분부터 시작합니다
          </Title>
        </ScrollFadeIn>
        <Text CN="text-right ">BellaDent는 보다 일찍 진료가 시작됩니다.</Text>
        <Text CN="text-right "> 점심시간 12:30 - 14:00</Text>
        <Text CN="text-right ">오후진료 14:00 - 18:00</Text>
        <Text CN="text-right ">토요일08:30 - 12:30</Text>
        <Text CN="text-right ">※ 일요일 및 법정공휴일은 휴진을 합니다</Text>
      </ScrollBgBox>

      <Wrapper CN="py-40">
        <Container>
          <Card
            image={home_sec_5_1}
            CN="mx-auto flex flex-row justify-between gap-12 pb-20"
          >
            <ScrollFadeIn delay={0.3}>
              <Title CN="text-4xl">치과 치료 과정</Title>
            </ScrollFadeIn>
            <Text CN="text-lg">
              치과 엑스레이 이미지 분석을 통해 ▲악안면부에 생길 수 있는 낭, 양성
              종양, 악성 종양 및 기타 골질환 ▲턱관절의 퇴행성골관절염 ▲림프절
              석회화 등의 진단에 기여했고 의학적 치료에 연계돼 조기 치료에
              도움이 된다고 판단했다.악안면부에 생길 수 있는 낭, 양성 종양, 악성
              종양 및 기타 골질환 진단이 의미가 있는 이유는 임상적 증상 없이
              커지는 경우가 많아 주의가 필요한 질환들이기 때문이다. 증상이
              나타나 병원을 찾게 되면 치료 범위가 너무 광범위하거나 예후가 나쁜
              경우가 많은 질환으로 조기 발견이 중요하다.
            </Text>
            <Button CN="bg-BD-CharcoalBlack text-BD-ElegantGold w-40 py-4 rounded-2xl text-md mt-4">
              button
            </Button>
          </Card>
        </Container>

        <hr />

        <Container>
          <div className="px-5 py-20">
            <Text>BellaDent</Text>
            <Title CN="text-4xl">임플란트(implant)특별한 장점</Title>
            <Text CN="mt-6">인공치아 시술을 잘하는 전문 병원</Text>
            <Text>
              보철물의 일종을 심기 때문에 implant 시술로 부르는 것이다.
            </Text>
            <Text CN="mt-6">충치치료</Text>
            <Text>
              충치나 풍치 치료의 최후처방인 발치 이후 치료법 중 하나이다.
            </Text>
            <Text CN="mt-6">임플란트  </Text>
            <Text>
              임플란트 개수, 치조골 이식의 동반 여부에 따라 길어질 수도 있다.
            </Text>
          </div>
        </Container>

        <hr />
      </Wrapper>

      <ScrollBgBox
        CN="w-full h-300 flex flex-col items-end justify-center pe-90 bg-cover bg-fixed"
        url={home_bg_4}
      >
        <ScrollFadeIn delay={0.2}>
          <Title CN="text-right text-2xl">BellaDent 
PREMIUM DENTAL CARE
</Title>
        </ScrollFadeIn>
        <Text CN="text-right">통합치의학과 전문의 | 대한치과이식임플란트학회 우수임플란트 임상의 | 대한심미치과학회 인정의</Text>
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
              <Title CN="text-4xl">장비와
시스템</Title>
            </ScrollFadeIn>
            <Text CN="text-lg">진료를 위해 대학병원급 진료장비를 갖추었습니다. 작은 것 하나도 놓치지 않고 정확하게 진단하고 진료과정에서 불편함이 느껴지지 않도록 그리고 더 안전한 진료환경을 갖추었습니다.</Text>
            <Button CN="bg-BD-CharcoalBlack text-BD-ElegantGold w-40 py-4 rounded-2xl text-md mt-4">
              button
            </Button>
          </CardCarousel>
        </Container>

        <hr />

        <Container>
          <Title CN="px-5 text-4xl text-center mt-20">BellaDent 치과 둘러보기</Title>
          <Text CN="px-5 text-center">우수한 수준의 장비를 통해 보다 정밀하고 꼼꼼한 치료를 합니다</Text>
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
            <Title CN="text-4xl">주소: 광주광역시 남구 봉선중앙로 102, 벨라메디타워 4층 </Title>
            <Text CN="">오시는 길 안내</Text>
          </div>
          <div className="flex flex-col gap-4 p-12 bg-BD-ElegantGold text-BD-CharcoalBlack z-10">
            <Title CN="text-4xl">BellaDent 광주광역시 남구 봉선중앙로 102, 벨라메디타워 4층</Title>
            <Text CN="">자가용 </Text>
            <Text CN="mt-4">※ 주차는 건물뒷편 기계식주차를 이용하시면 되며 관리인이 주차를 도와드립니다</Text>
            <Text CN="">※ 주차비 무료를 위해 원무과에서 확인도장을 꼭 받아가시기 바랍니다.</Text>
            <Text CN="">버스노선안내</Text>
            <Text CN="">오시는 길 안내</Text>
            <Text CN="">버스노선 : 01, 45, 47, 26. . . . .</Text>
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
