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
        CN="w-full h-30 flex justify-center items-center overflow-hidden object-cover"
        image={line_banner}
      >
        <Title
          as="h2"
          size="lg"
          CN="text-center text-BD-CharcoalBlack text-shadow-lg/20"
        >
          내부 둘러보기
        </Title>
        <Text size="md" CN="text-center">
          Inside our clinic
        </Text>
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
