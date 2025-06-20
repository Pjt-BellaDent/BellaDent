import React from 'react';
import { useHospitalInfo } from '../../../../contexts/HospitalContext';

import LineImageBanner from '../../../../components/web/LineImageBanner';
import Container from '../../../../components/web/Container';
import CardMap from '../../../../components/web/CardMap';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';

import line_banner from '../../../../assets/images/line_banner.png';

function location() {
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
          <Title CN="text-4xl text-center"><b>오시는 길 안내</b></Title>
          <Text CN="text-xl text-center">"How to get here?"</Text>{' '}
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
            <Title CN="text-6xl">BellaDent  </Title>
            <Title CN="text-4xl">PREMIUM DENTAL CARE</Title>
            <Text CN="text-xl">건강한 치아</Text>
          </div>

          <Title CN="text-4xl">주소: 광주광역시 남구 봉선중앙로 102, 벨라메디타워 4층</Title>
          <hr className="my-6" />
          <Title CN="text-4xl">주차장 안내</Title>
          <Text CN="mt-6 text-xl">※ 주차비 무료를 위해 원무과에서 확인도장을 꼭 받아가시기 바랍니다.</Text>
          <hr className="my-6" />
          <Title CN="text-4xl">버스노선 : 01, 45, 47, 26. . . . .</Title>
          
        </CardMap>
      </Container>
    </>
  );
}

export default location;
