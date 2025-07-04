import React from 'react';
import LineImageBanner from '../../../../components/web/LineImageBanner';
import Title from '../../../../components/web/Title'; // 수정된 Title 컴포넌트
import Text from '../../../../components/web/Text'; // 수정된 Text 컴포넌트

import line_banner from '../../../../assets/images/line_banner.png';
import orthod1 from '../../../../assets/orthod1.png';
import orthod2 from '../../../../assets/orthod2.png';
import orthod3 from '../../../../assets/orthod3.png';
import orthod4 from '../../../../assets/orthod4.png';
import orthod5 from '../../../../assets/orthod5.png';
import orthod6 from '../../../../assets/orthod6.png';
import chia6 from '../../../../assets/chia6.png';
import alqor from '../../../../assets/alqor.png';
import chia12 from '../../../../assets/chia12.png';
import chia9 from '../../../../assets/chia9.png';
import ch10 from '../../../../assets/ch10.png';
import ca6 from '../../../../assets/ca6.png';
import ca7 from '../../../../assets/ca7.png';
import ca5 from '../../../../assets/ca5.png';
import cav from '../../../../assets/cav.png';
import ca4 from '../../../../assets/ca4.png';
import cav3 from '../../../../assets/cav3.png';
import cav2 from '../../../../assets/cav2.png';

function gallery() {
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
          전후 사진 겔러리
        </Title>
        <Text size="md" CN="text-center">
          Before and After Photo Gallery
        </Text>
      </LineImageBanner>
      <div className="max-w-300 mx-auto">
        {/* h3를 Title 컴포넌트로 변경 */}
        <Title as="h2" size="lg" CN="text-center mt-10 mb-6">
          Before & After
        </Title>
        <div className="flex flex-wrap ">
          {/* p 태그를 Text 컴포넌트로 변경 */}
          <Text size="base" CN="mt-6 mx-auto">
            병원의 진료 과정을 소개하기 위해 전후 사진을 게재합니다.
          </Text>
          <Text size="base" CN="mb-8 mx-auto">
            많은 치과 병원이 치료 전후 사진을 환자들에게 진료 사례를 보여줍니다.
          </Text>
          <img src={orthod1} alt="orthod1" />
          <img src={orthod2} alt="orthod2" />
          <img src={orthod3} alt="orthod3" />
          <img src={orthod4} alt="orthod4" />
          <img src={orthod5} alt="orthod5" />
          <img src={orthod6} alt="orthod6" />
          <img src={chia6} alt="chia6" />
          <img src={alqor} alt="alqor" />

          <img src={chia12} alt="chia12" />
          <img src={chia9} alt="chia9" />

          <img src={ch10} alt="ch10" />

          <img src={ca6} alt="ca6" />
          <img src={ca7} alt="ca7" />
          <img src={ca5} alt="ca5" />
          <img src={cav} alt="cav" />
          <img src={ca4} alt="ca4" />

          <img src={cav3} alt="cav3" />
          <img src={cav2} alt="cav2" />
        </div>
      </div>
      <div className="flex justify-center gap-2 mb-[165px] mx-5"></div>
    </>
  );
}

export default gallery;
