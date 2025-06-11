import React from 'react';
import dentistry from '../assets/dentistry.png';
import orthod1 from '../assets/orthod1.png';
import orthod2 from '../assets/orthod2.png';
import orthod3 from '../assets/orthod3.png';
import orthod4 from '../assets/orthod4.png';
import orthod5 from '../assets/orthod5.png';
import orthod6 from '../assets/orthod6.png';
import chia6 from '../assets/chia6.png';
import alqor from '../assets/alqor.png';
import alqorr from '../assets/alqorr.png';
import chia9 from '../assets/chia9.png';
import ch10 from '../assets/ch10.png';
import ca6 from '../assets/ca6.png';
import ca7 from '../assets/ca7.png';
import ca5 from '../assets/ca5.png';
import cav from '../assets/cav.png';
import ca4 from '../assets/ca4.png';

import cav3 from '../assets/cav3.png';
import cav2 from '../assets/cav2.png';

function TreatmentInfo_6() {
  return (
    <>
      <div className="relative">
        <img
          src={dentistry}
          alt="dentistry"
          className="w-full h-50 object-cover"
        />
        <p className="absolute left-[50%] top-[50%] -translate-[50%] text-white text-shadow-lg/20 text-[32px]">
          <b>전후 사진 겔러리</b>
        </p>
      </div>
      <div className="max-w-300 mx-auto">
        <h3 className="text-center text-[48px] mt-10 mb-6"><b>Before & After</b> </h3>
        <div className="flex flex-wrap ">
          <div className="text-[24px] mt-6 mx-auto">
            <p className='text-[24px] mb-4'> 병원의 진료 과정을 소개하기 위해 전후 사진을 게재합니다.</p>
            <p  className='text-[24px] mb-8'>
              많은 치과 병원이 치료 전후 사진을 환자들에게 진료 사례를
              보여줍니다.
            </p>
          </div>
          <img src={orthod1} alt="orthod1" />
          <img src={orthod2} alt="orthod2" />
          <img src={orthod3} alt="orthod3" />
          <img src={orthod4} alt="orthod4" />
          <img src={orthod5} alt="orthod5" />
          <img src={orthod6} alt="orthod6" />
          <img src={chia6} alt="chia6" />
          <img src={alqor} alt="alqor" />
          <img src={alqorr} alt="alqorr" />
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

export default TreatmentInfo_6;
