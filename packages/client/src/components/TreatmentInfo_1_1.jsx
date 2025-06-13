import React from 'react';
import teeth from '../assets/teeth.png';
import cavities from '../assets/cavities.png';
import cavi from '../assets/cavi.png';

function TreatmentInfo_1_1() {
  return (
    <div className=" max-w-300 mx-auto">
      <h3 className=" mt-15 mb-15 text-[48px] text-center">
        <b>진료과목소개</b>
      </h3>
      <hr />

      <div className="flex gap-7 mt-15 mx-5">
        <img src={teeth} alt="teeth" className="w-72 mb-15" />
        <div>
          <h2 className="text-[24px] mt-8 mb-8">
            <b>충치치료</b>
          </h2>
          <p className="text-[18px]">
            치아 신경 치료는 심한 충치, 외상, 파절 등으로 인해 염증이 발생한
            치아의 신경을 치료하는 과정입니다.
          </p>
          <p className="text-[18px]">
            치아 내부의 신경 조직을 제거하고 소독 및 충전재로 채운 후, 약해진
            치아를 보호하기 위한 크라운 치료를 진행합니다.
          </p>
        </div>
      </div>
      <hr className="mb-15" />
      <div className="flex">
        <div className="flex flex-1 flex-col justify-between mx-5">
          <img src={cavities} alt="cavities" className="W-70" />

          <div>
            <p className="mb-3">
              <strong className="text-[24px] mt-16 mb-3">신경치료</strong>
            </p>
            <p className="text-[18px]">
              신경 조직 제거: 치아 내부의 신경 조직을 제거합니다.
            </p>
            <p className="text-[18px]">
              
                치아 신경 치료의 과정: 치아 검사: 충치나 손상 정도, 신경의 염증
                상태를 확인합니다. 치아 접근: 충치 부분을 제거하고 치아 내부로
                치료 도구가 들어갈 수 있도록 통로를 만듭니다.
              
            </p>
          </div>
        </div>

        <div className="flex flex-1 gap-12 flex-col-reverse mx-5">
          <img src={cavi} alt="cavi" className="mt-4" />
          <div className="mt-16 mb-3">
            <p className="text-[24px] mt-16 mb-3">
              <b>신경 조직</b>
            </p>
            <p className="text-[18px]">
              신경 조직 제거: 치아 내부의 신경 조직을 제거합니다.{' '}
            </p>
            <p className="text-[18px]">
              소독 및 충전: 제거된 신경 조직 공간을 소독하고 생체 친화적인
              재료로 채웁니다.
            </p>
            <p className="text-[18px]">
              크라운 치료 (선택적): 약해진 치아를 보호하기 위해 크라운을
              착용합니다.
            </p>
          </div>
        </div>
      </div>
      <hr className="mb-30 mt-15" />
    </div>
  );
}

export default TreatmentInfo_1_1;