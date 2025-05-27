import React from 'react';
import dental1 from '../assets/dental1.png';
import phl from '../assets/phl.png';
import dentalchair from '../assets/dentalchair.png';
import chigwasecheoggi from '../assets/chigwasecheoggi.png';
import Laser from '../assets/Laser.png';

function TreatmentInfo_3() {
  return (
    <div className=" max-w-300 mx-auto">
      <div>
        <h1 className="flex justify-center md:text-balance mt-10 mb-6">
          <b>장비소개</b>
        </h1>
        <h2 className="flex justify-center mt-10 mb-6">
          <b>충치치료장비 </b>
        </h2>
      </div>

      <div>
        <div className="flex gap-12 mx-5">
          <div className="mt-10 mb-6">
            <img src={dental1} alt="dental1" />
          </div>
          <div className=" mt-10 mb-6">
            <p className="mt-6 mb-3 ">
              <b>3D-CT EXO-X</b>
            </p>
            <p className='text-justify'>저선량CT</p>
            <p className="text-justify main-text">
              파노라마 보다 적은 방사선량 으로 부터 Dital Dentistry 에 <br />
              활용하는데 있어서도 매우 정확한
              <br />
              CBCT 영상구현이 가능합니다
            </p>

            <p className="text-justify">
              치아 신경 치료는 심한 충치, 외상, 파절 등으로 인해 염증이 발생한
              치아의 신경을 치료하는 과정입니다. <br />
              치아 내부의 신경 조직을 제거하고 소독 및 충전재로 채운 후, 약해진
              치아를 보호하기 위한 <br /> 크라운 치료를 진행합니다.
            </p>
          </div>
        </div>
        <hr className="mt-3 mb-6" />
        <div className="flex gap-12 mx-5 flex-row-reverse justify-between">
          <div className=" mt-10 mb-6">
            <img src={phl} alt="phl" />
          </div>
          <div className="mt-10 mb-6">
            <p className="mt-6 mb-3">
              <b>턱관절물리치료 PHL레이저</b>
            </p>
            <p>저주파 물리치료와 열치료로 턱관절통증를 개선할 수 있으며 생체 치료의 파장을 갖고 있어 턱관절을 치료 할 수 있습니다. </p>
            <p>턱관절 물리치료는 어떻게 하나요? 턱관절 물리치료를 위해 사용되는 장비로는 PHL-15 레이저가 있습니다.<br/> 
            이것은 Perfect Healing Laser를 줄인 말로써 저출력 레이저를 이용해 턱관절 주변의 근육을 자극하고 통증을 완화시켜 주는 역할을 합니다.
              
             
              
            </p>
          </div>
        </div>
        <hr className="mt-3 mb-6" />
        <div className="flex gap-12 mx-5">
          <div className="mt-10 mb-6">
            <img src={dentalchair} alt="dentalchair" />
          </div>
          <div className="mt-10 mb-6">
            <p className="mt-6 mb-3">
              <b>3차원 디지털 CT의 특별함</b>
            </p>
            <p>컴퓨터 단층 촬영/Facial CT</p>
            <p className="main-text">
              수년간 축적된 코성형 노하우를 바탕으로 코의 외형적인 모양과 함께
              겉으로는 알 수 없었던 코뼈, 비중격연골,
            </p>
            <p>
              하비갑개의 상태를 코 성형 전문 3D CT 촬영을 통해 입체적이고 정밀한
              분석과 개인별 맞춤형 수술이 가능합니다.
            </p>
          </div>
        </div>
        <hr className="mt-3 mb-6" />
        <div className="flex gap-12 flex-row-reverse justify-between mx-5">
          <div className="mt-10 mb-6">
            <img src={chigwasecheoggi} alt="chigwasecheoggi" />
          </div>
          <div className="mt-10 mb-6">
            <p className=" mt-6 mb-3">
              <b>세척기</b>
            </p>
            <p>초음파 세척기</p>
            <p className="main-text">
              물속에서 발생된 진동수 매분 3만~4만의 초음파로 물체를 세척하는
              장치입니다.
            </p>
            <p>
              초음파가 액체 입자나 고체를 파괴,분산시키는 작용을 응용한 것으로
              의료기구의 소독에 사용합니다.
            </p>
          </div>
        </div>
        <hr className="mt-3 mb-6" />
        <div className="flex gap-12 mx-5 mb-15">
          <div className="mt-10 mb-6">
            <img src={Laser} alt="Laser" />
          </div>
          <div className="mt-10 mb-6">
            <p className="mt-6 mb-3">
              <b>임플란트</b>
            </p>
            <p>적은 통증 안전하게 레이저</p>
            <p>
              스케일링,잇몸치료,충치치료,신경치료,임플란트
              <br />
              치과 치료 대부분 사용되며 치료결과에 대한 만족도를 높입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TreatmentInfo_3;
