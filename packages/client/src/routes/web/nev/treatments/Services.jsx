import React from 'react';
import LineImageBanner from '../../../../components/web/LineImageBanner';
import Title from '../../../../components/web/Title'; // Title 컴포넌트 임포트
import Text from '../../../../components/web/Text'; // Text 컴포넌트 임포트
import Container from '../../../../components/web/Container'; // Container 컴포넌트 임포트
import RowBox from '../../../../components/web/RowBox'; // RowBox 컴포넌트 임포트
import ImageBox from '../../../../components/web/ImageBox'; // ImageBox 컴포넌트 임포트 (썸네일 기능은 사용 안 함)

import line_banner from '../../../../assets/images/line_banner.png';
import teeth from '../../../../assets/teeth.png';
import cavities from '../../../../assets/cavities.png';
import cavi from '../../../../assets/cavi.png';
import ch1 from '../../../../assets/ch1.png';
import ch from '../../../../assets/ch.png';
import sim from '../../../../assets/sim.png';
import sm from '../../../../assets/sm.png';
import smi from '../../../../assets/smi.png';
import smil from '../../../../assets/smil.png';
import smile from '../../../../assets/smile.png';
import laugh from '../../../../assets/laugh.png';
import laug from '../../../../assets/laug.png';

function Services() {
  const imagesRow1 = [ch1, ch, sim, smil];
  const imagesRow2 = [sm, smi, laugh, laug];

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
          진료과목안내
        </Title>
        <Text size="md" CN="text-center">
          Medical department information
        </Text>
      </LineImageBanner>
      <Container>
        <RowBox CN="gap-7 mt-15 mx-5 items-center">
          {/* flex -> RowBox, gap, mx 적용 */}
          <img src={teeth} alt="teeth" className="w-72 mb-15" />{' '}
          {/* w-72는 Tailwind 기본값 아님, 적절한 w-XX 필요 */}
          <div className="flex-1">
            {/* flex-1 추가 */}
            <Text size="md" CN="mb-3">
              {/* h2 -> Title */}
              <b>충치치료</b> {/* b 태그 제거 */}
            </Text>
            <Text size="md">
              {/* p -> Text */}
              치아 신경 치료는 심한 충치, 외상, 파절 등으로 인해 염증이 발생한
              치아의 신경을 치료하는 과정입니다.
            </Text>
            <Text size="md">
              {/* p -> Text */}
              치아 내부의 신경 조직을 제거하고 소독 및 충전재로 채운 후, 약해진
              치아를 보호하기 위한 크라운 치료를 진행합니다.
            </Text>
          </div>
        </RowBox>
        <hr className="mb-15" />
        <RowBox CN="flex-wrap justify-center gap-12">
          {/* flex -> RowBox, flex-wrap, justify-center, gap 적용 */}
          <div className="flex flex-col flex-1 items-center mx-5">
            {/* flex-1, items-center 추가 */}
            <img src={cavities} alt="cavities" /> {/* W-70 -> w-70 */}
            <div className="text-center">
              {/* 텍스트 중앙 정렬 */}
              <Text as="p" size="md" CN="my-3">
                {/* p -> Text */}
                <strong className="text-xl mt-16 mb-3">신경치료</strong>
                {/* strong은 Text 컴포넌트 내부에서 처리. 필요시 CN prop으로 font-bold */}
              </Text>
              <Text size="md">
                {/* p -> Text */}
                신경 조직 제거: 치아 내부의 신경 조직을 제거합니다.
              </Text>
              <Text size="md">
                {/* p -> Text */}
                치아 신경 치료의 과정: 치아 검사: 충치나 손상 정도, 신경의 염증
                상태를 확인합니다. 치아 접근: 충치 부분을 제거하고 치아 내부로
                치료 도구가 들어갈 수 있도록 통로를 만듭니다.
              </Text>
            </div>
          </div>
          <div className="flex flex-col-reverse flex-1 items-center mx-5">
            {/* flex-1, flex-col-reverse, items-center 추가 */}
            <img src={cavi} alt="cavi" className="mt-4" />
            <div className="mt-16 mb-3 text-center">
              {/* 텍스트 중앙 정렬 */}
              <Text as="p" size="md" CN="mb-3">
                {/* p -> Text */}
                <b>신경 조직</b> {/* b 태그 제거 */}
              </Text>
              <Text size="md">
                {/* p -> Text */}
                신경 조직 제거: 치아 내부의 신경 조직을 제거합니다.{' '}
              </Text>
              <Text size="md">
                {/* p -> Text */}
                소독 및 충전: 제거된 신경 조직 공간을 소독하고 생체 친화적인
                재료로 채웁니다.
              </Text>
              <Text size="md">
                {/* p -> Text */}
                크라운치료(선택적):약해진 치아를 보호하기 위해 크라운을
                착용합니다.
              </Text>
            </div>
          </div>
        </RowBox>
        <hr className="mb-30 mt-15" />
      </Container>
      <div className="relative">
        <img
          src={smile}
          alt="smile"
          className="w-full h-[940px] object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          {' '}
          {/* text 클래스 대신 flexbox로 중앙 정렬 */}
          <Text size="md" CN="mb-4 text-white">
            {' '}
            {/* p -> Text */}
            예쁜미소+아름다운모습+치아+백색치아
          </Text>
          <Text size="md" CN="mb-4 text-white">
            {' '}
            {/* p -> Text */}
            하얀 치아와 고른 치열, 시원한 입매, 환한 미소 연예인들의 미소를{' '}
          </Text>
          <Text size="md" CN="mb-4 text-white">
            {' '}
            {/* p -> Text */}
            더욱 밝고 매력적으로 만들어주는 데는 '치아'가 정말 중요한 역할을
            합니다.
          </Text>
        </div>
      </div>
      <Container>
        {' '}
        {/* 최상위 div를 Container로 감쌈 */}
        <Title as="h2" size="lg" CN="mt-15 mb-6 text-center">
          {' '}
          {/* h3 -> Title, mt/mb/mx 직접 적용 */}
          <b>하얀치아 예쁜미소</b> {/* b 태그 제거 */}
        </Title>
        <hr className="max-w-xs mx-auto mt-4.5" />{' '}
        {/* max-w-300 -> max-w-xs (적절한 값으로 변경) */}
        <Text as="p" size="lg" CN="text-center mt-23 mb-8 mx-5">
          하얀 치아 교정
        </Text>{' '}
        {/* p -> Text */}
        <ImageBox
          images={imagesRow1}
          CCN="flex justify-center gap-2 mx-5" // ImageBox의 Container Class Name
          CN="max-w-[calc(25%-0.5rem)]" // 각 이미지 박스의 너비, gap 2는 0.5rem
        />
        <Text as="p" size="lg" CN="text-center mt-21 mb-8">
          하얀 치아 미소
        </Text>{' '}
        {/* p -> Text */}
        <ImageBox
          images={imagesRow2}
          CCN="flex justify-center gap-2 mb-15 mx-5" // ImageBox의 Container Class Name
          CN="max-w-[calc(25%-0.5rem)]" // 각 이미지 박스의 너비
        />
      </Container>
    </>
  );
}

export default Services;
