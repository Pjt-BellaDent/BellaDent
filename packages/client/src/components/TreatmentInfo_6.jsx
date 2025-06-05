import React from 'react';
import dentistry from '../assets/dentistry.png';
import orthod1 from '../assets/orthod1.png';
import orthod2 from '../assets/orthod2.png';
import orthod3 from '../assets/orthod3.png';
import orthod4 from '../assets/orthod4.png';
import orthod5 from '../assets/orthod5.png';
import orthod6 from '../assets/orthod6.png';
import chia6 from '../assets/chia6.png';
import chia7 from '../assets/chia7.png';
import chia8 from '../assets/chia8.png';
import chia9 from '../assets/chia9.png';
import chia10 from '../assets/chia10.png';
import chia11 from '../assets/chia11.png';
import chia12 from '../assets/chia12.png';
import chia13 from '../assets/chia13.png';
import chia4 from '../assets/chia4.png';
import chia14 from '../assets/chia14.png';
import chia15 from '../assets/chia15.png';
import chia16 from '../assets/chia16.png';
import chia17 from '../assets/chia17.png';

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
        <h3 className="text-center text-[48px] mt-10 mb-6">Before & After</h3>
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
          <img src={chia7} alt="chia7" />
          <img src={chia8} alt="chia8" />
          <img src={chia9} alt="chia9" />
          <img src={chia10} alt="chia10" />
          <img src={chia11} alt="chia11" />
          <img src={chia12} alt="chia12" />
          <img src={chia13} alt="chia13" />
          <img src={chia4} alt="chia4" />
          <img src={chia14} alt="chia14" />
          <img src={chia15} alt="chia15" />
          <img src={chia16} alt="chia16" />
          <img src={chia17} alt="chia17" />
        </div>
      </div>
      <div className="flex justify-center gap-2 mb-[165px] mx-5"></div>
    </>
  );
}

export default TreatmentInfo_6;
