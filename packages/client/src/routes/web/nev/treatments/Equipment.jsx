import React from 'react';
import LineImageBanner from '../../../../components/web/LineImageBanner';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';
import Container from '../../../../components/web/Container';
import RowBox from '../../../../components/web/RowBox';

import line_banner from '../../../../assets/images/line_banner.png'; // 추가 임포트
import dental1 from '../../../../assets/dental1.png'; // 경로 확인
import phl from '../../../../assets/phl.png'; // 경로 확인
import dentalchair from '../../../../assets/dentalchair.png'; // 경로 확인
import chigwasecheoggi from '../../../../assets/chigwasecheoggi.png'; // 경로 확인
import Laser from '../../../../assets/Laser.png'; // 경로 확인

function Equipment() {
  return (
    <>
      <LineImageBanner
        CN="w-full h-40 flex justify-center items-center overflow-hidden"
        image={line_banner}
      >
        <div className="flex flex-col justify-center items-center">
          <Title
            as="h1"
            size="lg"
            CN="text-center text-BD-CharcoalBlack text-shadow-lg/20"
          >
            장비소개
          </Title>
          <Text size="md" CN="text-center">
            introduction of equipment
          </Text>
        </div>
      </LineImageBanner>
      <Container>
        <Title
          as="h2"
          size="lg"
          CN="flex justify-center md:text-balance mt-10 mb-6"
        >
          충치치료장비
        </Title>
        <div>
          <RowBox CN="gap-12 mx-5 justify-between flex-wrap">
            <div className="mt-10 mb-6 w-full flex-1 min-w-[300px]">
              <img src={dental1} alt="dental1" className="w-full block" />
            </div>
            <div className="mt-10 mb-6 max-w-full flex-1 min-w-[300px]">
              <Title as="h3" size="sm" CN="mt-6 mb-3">
                3D-CT EXO-X
              </Title>
              <Text size="lg">저선량CT</Text>
              <Text size="lg" CN="line-clamp-9 text-justify">
                파노라마 보다 적은 방사선량 으로 부터 Dital Dentistry 에
                활용하는데 있어서도 매우 정확한 CBCT 영상구현이 가능합니다. 치아
                신경 치료는 심한 충치, 외상, 파절 등으로 인해 염증이 발생한
                치아의 신경을 치료하는 과정입니다. 치아 내부의 신경 조직을
                제거하고 소독 및 충전재로 채운 후, 약해진 치아를 보호하기 위한
                크라운 치료를 진행합니다.
              </Text>
            </div>
          </RowBox>
          <hr className="mt-3 mb-6 mx-5 " />
          <RowBox CN="gap-12 mx-5 flex-row-reverse justify-between flex-wrap">
            <div className="mt-10 mb-6 w-full flex-1 min-w-[300px]">
              <img src={phl} alt="phl" className="w-full block" />
            </div>
            <div className="mt-10 mb-6 max-w-full flex-1 min-w-[300px]">
              <Title as="h3" size="sm">
                턱관절물리치료 PHL레이저
              </Title>
              <Text size="lg" CN="mt-6 mb-6 line-clamp-15 text-justify">
                저주파 물리치료와 열치료로 턱관절통증를 개선할 수 있으며 생체
                치료의 파장을 갖고 있어 턱관절을 치료 할 수 있습니다. 턱관절
                물리치료는 어떻게 하나요? 턱관절 물리치료를 위해 사용되는
                장비로는 PHL-15 레이저가 있습니다. 이것은 Perfect Healing
                Laser를 줄인 말로써 저출력 레이저를 이용해 턱관절 주변의 근육을
                자극하고 통증을 완화시켜 주는 역할을 합니다.
              </Text>
            </div>
          </RowBox>
          <hr className="mt-3 mb-6" />
          <RowBox CN="gap-12 mx-5 flex-wrap">
            <div className="mt-10 mb-6 w-full flex-1 min-w-[300px]">
              <img
                src={dentalchair}
                alt="dentalchair"
                className="w-full block"
              />
            </div>
            <div className="mt-10 mb-6 max-w-full flex-1 min-w-[300px]">
              <Title as="h3" size="sm" CN="mt-6 mb-3 line-clamp-15">
                3차원 디지털 CT의 특별함
              </Title>
              <Text size="lg">
                컴퓨터 단층 촬영/Facial CT 수년간 축적된 코성형 노하우를
                바탕으로 코의 외형적인 모양과 함께 겉으로는 알 수 없었던 코뼈,
                비중격연골, 하비갑개의 상태를 코 성형 전문 3D CT 촬영을 통해
                입체적이고 정밀한 분석과 개인별 맞춤형 수술이 가능합니다.
              </Text>
            </div>
          </RowBox>
          <hr className="mt-3 mb-6" />
          <RowBox CN="gap-12 flex-row-reverse justify-between mx-5 flex-wrap">
            <div className="mt-10 mb-6 w-full flex-1 min-w-[300px]">
              <img
                src={chigwasecheoggi}
                alt="chigwasecheoggi"
                className="w-full block"
              />
            </div>
            <div className="mt-10 mb-6 max-w-full flex-1 min-w-[300px]">
              <Title as="h3" size="sm">
                세척기
              </Title>
              <Text size="lg" CN="mt-6 mb-3 line-clamp-15">
                초음파 세척기 물속에서 발생된 진동수 매분 3만~4만의 초음파로
                물체를 세척하는 장치입니다. 초음파가 액체 입자나 고체를
                파괴,분산시키는 작용을 응용한 것으로 의료기구의 소독에
                사용합니다.
              </Text>
            </div>
          </RowBox>
          <hr className="mt-3 mb-6" />
          <RowBox CN="gap-12 mx-5 mb-15 justify-between flex-wrap">
            <div className="mt-10 mb-6 w-full flex-1 min-w-[300px]">
              <img src={Laser} alt="Laser" className="w-full block" />
            </div>
            <div className="mt-10 mb-6 max-w-full flex-1 min-w-[300px]">
              <Title as="h3" size="sm">
                임플란트
              </Title>
              <Text size="lg" CN="mt-6 mb-3 line-clamp-15">
                적은 통증 안전하게 레이저
                스케일링,잇몸치료,충치치료,신경치료,임플란트 치과 치료 대부분
                사용되며 치료결과에 대한 만족도를 높입니다.
              </Text>
            </div>
          </RowBox>
        </div>
      </Container>
    </>
  );
}

export default Equipment;
