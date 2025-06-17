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
          <Title CN="text-4xl text-center">Welcome to Our Clinic</Title>
          <Text CN="text-xl text-center">Your health is our priority</Text>{' '}
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
            <Title CN="text-6xl">Welcome to Our Clinic</Title>
            <Title CN="text-4xl">Welcome to Our Clinic</Title>
            <Text CN="text-xl">Your health is our priority</Text>
          </div>

          <Title CN="text-4xl">Welcome to Our Clinic</Title>
          <hr className="my-6" />
          <Title CN="text-4xl">Welcome to Our Clinic</Title>
          <hr className="my-6" />
          <Title CN="text-4xl">Welcome to Our Clinic</Title>
          <Text CN="text-xl">Your health is our priority</Text>
        </CardMap>
      </Container>
    </>
  );
}

export default location;
