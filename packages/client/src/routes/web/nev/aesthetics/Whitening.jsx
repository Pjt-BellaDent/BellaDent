import React from 'react';
import LineImageBanner from '../../../../components/web/LineImageBanner';
import Title from '../../../../components/web/Title'; // 수정된 Title 컴포넌트
import Text from '../../../../components/web/Text'; // 수정된 Text 컴포넌트

import line_banner from '../../../../assets/images/line_banner.png';
import miso from '../../../../assets/miso.png';
import miso1 from '../../../../assets/miso1.png';
import miso2 from '../../../../assets/miso2.png';

function Whitening() {
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
            미백/라미네이트
          </Title>
          <Text size="md" CN="text-center">
            teeth whitening,laminate
          </Text>
      </LineImageBanner>
      <div className="max-w-300 mx-auto mb-15">
        {/* h3를 Title 컴포넌트로 변경 */}
        <Title as="h2" size="lg" CN="text-center mt-15 mx-30">
          하얀치아 미백/라미네이트
        </Title>
        {/* p 태그를 Title 컴포넌트로 변경 */}
        <Title as="h3" size="sm" CN="text-center mt-15 mb-15 mx-5">
          미백 / 라미네이트
        </Title>
        <div className="flex justify-center gap-2 mx-5">
          <div className="flex flex-col flex-1">
            <img src={miso} alt="miso" className="w-full" />
            {/* h3를 Title 컴포넌트로 변경 */}
            <Title as="h3" size="sm" CN="text-center mt-15 mb-8">
              미백 치료 효과
            </Title>
            {/* p 태그를 Text 컴포넌트로 변경 */}
            <Text size="base" CN="line-clamp-15 text-justify">
              미백 치료는 치아 색을 밝히는 효과가 있습니다 미백 효과는 개인의
              치아 상태나 변색 정도에 따라 다를 수 있습니다. 미백 효과는 3~5년
              정도 유지될 수 있습니다.
            </Text>
          </div>
          <div className="flex flex-col flex-1">
            <img src={miso1} alt="miso1" className="w-full" />
            {/* h3를 Title 컴포넌트로 변경 */}
            <Title as="h3" size="sm" CN="text-center mt-15 mb-8">
              레이저 미백
            </Title>
            {/* p 태그를 Text 컴포넌트로 변경 */}
            <Text size="base" CN="line-clamp-15 text-justify">
              특수 광선을 이용해 미백제를 활성화시켜 치아 색을 빠르게 밝히는
              방법입니다.
            </Text>
          </div>
          <div className="flex flex-col flex-1">
            <img src={miso2} alt="miso2" className="w-full" />
            {/* h3를 Title 컴포넌트로 변경 */}
            <Title as="h3" size="sm" CN="text-center mt-15 mb-8">
              주의사항
            </Title>
            {/* p 태그를 Text 컴포넌트로 변경 */}
            <Text size="base" CN="line-clamp-15 text-justify">
              미백 치료 후 잇몸 민감도가 높아질 수 있습니다. 치아의 변색 원인에
              따라 미백 효과가 달라질 수 있습니다. 일부 미백제는 치아 손상이나
              잇몸 염증을 유발할 수 있으므로, 전문가와 상담 후 치료를 진행하는
              것이 좋습니다.
            </Text>
          </div>
        </div>
        <div className="flex justify-center gap-2 mb-[165px] mx-5"></div>
      </div>
    </>
  );
}

export default Whitening;
