import React from 'react';
import dentistry from '../assets/dentistry.png';

import TreatmentInfo_1_1 from './TreatmentInfo_1_1';
import TreatmentInfo_1_2 from './TreatmentInfo_1_2';
import TreatmentInfo_1_3 from './TreatmentInfo_1_3';

function TreatmentInfo_1() {
  return (
    <>
      <div className="relative">
        <img
          src={dentistry}
          alt="dentistry"
          className="w-full h-50 object-cover"
        />
        <p className="absolute left-[50%] top-[50%] -translate-[50%] text-white text-shadow-lg/20 text-[32px]">
          <b>진료 과목 안내</b>
        </p>
      </div>
      <TreatmentInfo_1_1 />
      <TreatmentInfo_1_2 />
      <TreatmentInfo_1_3 />
    </>
    
  );
}

export default TreatmentInfo_1;
