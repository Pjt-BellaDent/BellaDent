import React from 'react';
import dentistry from '../assets/dentistry.png';
import orthod1 from '../assets/orthod1.png';
import orthod2 from '../assets/orthod2.png';
import orthod3 from '../assets/orthod3.png';
import orthod4 from '../assets/orthod4.png';
import orthod5 from '../assets/orthod5.png';
import orthod6 from '../assets/orthod6.png';

function TreatmentInfo_6() {
  return (
    <>
      <div className="relative">
        <img
          src={dentistry}
          alt="dentistry"
          className="w-full h-50 object-cover"
        />
        <p className="absolute left-[50%] top-[50%] -translate-[50%] text-white text-shadow-lg/20">
          <b>전후 사진 겔러리</b>
        </p>
      </div>
      <div className="max-w-300 mx-auto">
        <h3 className="text-center mt-10 mb-6">Before & After</h3>
        <div className="flex flex-col flex-1">
          <div className='mx-auto'>
          <p> 병원의 진료 과정을 소개하기 위해 전후 사진을 게재합니다.</p>
          <p>
            많은 치과 병원이 치료 전후 사진을 환자들에게 진료 사례를 보여줍니다.
          </p>
          </div>
          <img src={orthod1} className="" alt="orthod1" />
          <img src={orthod2} alt="orthod2" />
          <img src={orthod3} alt="orthod3" />
          <img src={orthod4} alt="orthod4" />
          <img src={orthod5} alt="orthod5" />
          <img src={orthod6} alt="orthod6" />
        </div>
      </div>
      
    </>
  );
}

export default TreatmentInfo_6;
