import React, { useState } from 'react'; // React 임포트 확인
import LineImageBanner from '../../../../components/web/LineImageBanner';
import Container from '../../../../components/web/Container';
import Title from '../../../../components/web/Title'; // 수정된 Title 컴포넌트
import Text from '../../../../components/web/Text'; // 수정된 Text 컴포넌트
import ImageBox from '../../../../components/web/ImageBox';

import line_banner from '../../../../assets/images/line_banner.png';
import home_sec_7_1 from '../../../../assets/images/home_sec_7_1.png';
import home_sec_7_2 from '../../../../assets/images/home_sec_7_2.png';
import home_sec_7_3 from '../../../../assets/images/home_sec_7_3.png';
import home_sec_7_4 from '../../../../assets/images/home_sec_7_4.png';
import home_sec_7_5 from '../../../../assets/images/home_sec_7_5.png';
import home_sec_7_6 from '../../../../assets/images/home_sec_7_6.png';
import home_sec_7_7 from '../../../../assets/images/home_sec_7_7.png';
import home_sec_7_8 from '../../../../assets/images/home_sec_7_8.png';

function Tour() {
  const [thumbnail, setThumbnail] = useState(home_sec_7_1);
  const imagesBox_1 = [
    home_sec_7_1,
    home_sec_7_2,
    home_sec_7_3,
    home_sec_7_4,
    home_sec_7_5,
    home_sec_7_6,
    home_sec_7_7,
    home_sec_7_8,
  ];

  return (
    <>
      <LineImageBanner
        CN="w-full h-40 flex justify-center items-center overflow-hidden"
        image={line_banner}
      >
        <div className="flex flex-col justify-center items-center">
          {/* Title 컴포넌트에 size prop 적용, <b> 태그 제거 */}
          <Title as="h1" size="lg" CN="text-center">
            치과병원 내부 둘러 보기
          </Title>
          {/* Text 컴포넌트에 size prop 적용 */}
          <Text size="md" CN="text-center">
            Take a look inside our dental clinic
          </Text>{' '}
        </div>
      </LineImageBanner>
      <Container CN="py-40">
        <div>
          <img
            src={thumbnail}
            alt={thumbnail}
            className="w-full object-cover rounded-xl"
          />
        </div>
        <ImageBox
          images={imagesBox_1}
          setThumbnail={setThumbnail}
          CCN="w-full mx-auto flex flex-wrap justify-between pt-20 gap-4"
          CN="max-w-[calc((100%-3rem)/4)]"
        />
      </Container>
    </>
  );
}

export default Tour;
