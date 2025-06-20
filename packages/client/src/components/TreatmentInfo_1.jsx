import React from 'react';
import LineImageBanner from './web/LineImageBanner';
import line_banner from '../assets/images/line_banner.png';
import Title from './/web/Title';
import Text from './/web/Text';
import TreatmentInfo_1_1 from './TreatmentInfo_1_1';
import TreatmentInfo_1_2 from './TreatmentInfo_1_2';
import TreatmentInfo_1_3 from './TreatmentInfo_1_3';

function TreatmentInfo_1() {
  return (
    <>
     <LineImageBanner
        CN="w-full h-40 flex justify-center items-center overflow-hidden"
        image={line_banner}
      >
        <div className="flex flex-col justify-center items-center">
          <Title CN="text-4xl text-center text-BD-CharcoalBlack text-shadow-lg/20"><b>진료과목 안내</b></Title>
          <Text CN="text-xl text-center">nformation on medical departments</Text>
        </div>
      </LineImageBanner>
      <TreatmentInfo_1_1 />
      <TreatmentInfo_1_2 />
      <TreatmentInfo_1_3 />
    </>
  );
}

export default TreatmentInfo_1;
