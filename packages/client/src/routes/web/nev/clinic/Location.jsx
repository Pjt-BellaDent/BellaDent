// src/routes/web/nev/clinic/location.jsx
import React from 'react';
import { useHospitalInfo } from '../../../../contexts/HospitalContext';

import LineImageBanner from '../../../../components/web/LineImageBanner';
import Container from '../../../../components/web/Container';
import CardMap from '../../../../components/web/CardMap';
import Title from '../../../../components/web/Title'; // 수정된 Title 컴포넌트
import Text from '../../../../components/web/Text'; // 수정된 Text 컴포넌트

import line_banner from '../../../../assets/images/line_banner.png';

function Location() {
  // 컴포넌트 이름 컨벤션에 따라 'location' -> 'Location'
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
      <LineImageBanner
        CN="w-full h-40 flex justify-center items-center overflow-hidden"
        image={line_banner}
      >
        <div className="flex flex-col justify-center items-center">
          {/* Title 컴포넌트에 size prop 적용, <b> 태그 제거 */}
          <Title as="h1" size="lg" CN="text-center">
            오시는 길 안내
          </Title>
          {/* Text 컴포넌트에 size prop 적용 */}
          <Text size="md" CN="text-center">
            "How to get here?"
          </Text>{' '}
        </div>
      </LineImageBanner>

      <Container CN="py-40">
        <CardMap
          image={line_banner}
          CN="flex flex-row justify-between gap-12"
          markersData={storeMarkers}
          zoom={17}
          address={hospitalInfo.address}
        >
          <div className="border p-4 mb-10">
            {/* Title 컴포넌트에 size prop 적용 */}
            <Title as="h3" size="xl">
              BellaDent{' '}
            </Title>
            <Title as="h4" size="lg">
              PREMIUM DENTAL CARE
            </Title>
            {/* Text 컴포넌트에 size prop 적용 */}
            <Text size="lg">건강한 치아</Text>
          </div>

          {/* Title 컴포넌트에 size prop 적용 */}
          <Title as="h3" size="lg">
            주소: 광주광역시 남구 봉선중앙로 102, 벨라메디타워 4층
          </Title>
          <hr className="my-6" />
          {/* Title 컴포넌트에 size prop 적용 */}
          <Title as="h3" size="lg">
            주차장 안내
          </Title>
          {/* Text 컴포넌트에 size prop 적용 */}
          <Text size="md" CN="mt-6">
            ※ 주차비 무료를 위해 원무과에서 확인도장을 꼭 받아가시기 바랍니다.
          </Text>
          <hr className="my-6" />
          {/* Title 컴포넌트에 size prop 적용 */}
          <Title as="h3" size="lg">
            버스노선 : 01, 45, 47, 26. . . . .
          </Title>
        </CardMap>
      </Container>
    </>
  );
}

export default Location; // 내보낼 때도 수정된 이름 사용
