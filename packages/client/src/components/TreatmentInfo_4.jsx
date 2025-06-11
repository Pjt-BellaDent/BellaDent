import React from 'react';
import dentistry from '../assets/dentistry.png';
import teeth1 from '../assets/teeth1.png';
import image from '../assets/image.png';
import dgim from '../assets/dgim.png';
import intelieo from '../assets/intelieo.png';
import picture from '../assets/picture.png';
import chair from '../assets/chair.png';
import dental2 from '../assets/dental2.png';
import dentall from '../assets/dentall.png';
import dental3 from '../assets/dental3.png';
import dental4 from '../assets/dental4.png';
import dental5 from '../assets/dental5.png';
import dental6 from '../assets/dental6.png';
import dental7 from '../assets/dental7.png';
import dental8 from '../assets/dental8.png';

function TreatmentInfo_4() {
  return (
    <>
      <div className="relative">
        <img
          src={dentistry}
          alt="dentistry"
          className="w-full h-50 object-cover"
        />
        <p className="absolute left-[50%] top-[50%] -translate-[50%] text-white text-shadow-lg/20 text-[32px]">
          <b>교정 / 미용치료</b>
        </p>
      </div>
      <div>
        <div className="justify-center max-w-300 mx-auto relative">
          <h2 className="text-center text-[48px] mt-[60px] mb-20 mx-10">
            <b>치아교정안내</b>
          </h2>
          <h3 className="text-[24px] mx-5">
            <b>치아교정 치료의 주요 목적</b>
          </h3>
          <hr className="my-2 mt-[80px] mx-10" />
          <div className="flex gap-7 mt-[80px] mx-5">
            <img src={teeth1} alt="teeth1" />

            <p className="text-[24px] text-blue-600 dark:text-sky-400 line-clamp-15 text-justify">
              치아교정 치료는 치아와 턱의 비정상적인 위치와 굽은 치아를 바로잡는
              치료 방법입니다. 비정상적인 치아와 턱의 위치는 예쁘지 않은 모습을
              만 수도 있습니다. 치아교정 치료는 단순히 외모 개선을 위한 것 뿐만
              아니라 올바른 구강 기능과 건강을 유지하는 데에도 큰 도움을 줄 수
              있습니다.
              
                예쁜 미소와 자신감 향상: 앞니가 앞으로 돌출되어 있는 경우에는
                사람들이 환자를 보고 일반적으로 좋지 않은 인상을 받을 수
                있습니다 비정상적인 치아와 턱의 위치를 치아교정을 통해
                바로잡으면 예쁜 미소와 자신감을 가질 수 있습니다. 치아가 너무
                밖으로 돌출되어 있는 경우에는 이를 보호하기 위해 입술이나 혀가
                치아를 덮으려고 압력을 가할 수 있어 이는 입술과 혀에 손상을
                일으킬 수 있고, 치아에도 부담을 주어 치아의 이상적인 기능을
                방해할 수 있습니다
              
            </p>
          </div>
          <hr className="my-2 mt-[80px] mb-6 mx-5" />
          <h3 className="flex justify-center md:text-balance text-[24px] mt-[80px] mb-6 mx-5">
            <b>미백/라미네이트</b>
          </h3>
          <div className="flex gap-12 flex-row-reverse justify-between mx-5">
            <img src={image} alt="image" />
            <p className="text-[24px] text-blue-600 dark:text-sky-400 line-clamp-15 text-justify">
              라미네이트란 자연치아를 거의 그대로 유지하면서 변색, 손상,
              형태이상, 파절 또는 치아 사이가 벌어져 못 생겨진 치아를
              
                정상적인 모양으로 복원하는 시술로 치과 시술 중 가장 심미적인
                영역이라고 할 수 있습니다.
              
             
                치아미백에 원리는 변색된 치아에 H2O2, Carbamide peroxide가
                주성분인 미백제를 도포하여 색소물질을 산화시키는 것입니다.
            
              
                치아미백은 미백제가 치아 속으로 스며들어 치아 속까지 하얗게
                만드는 것으로
              
              
                치아미백을 받은 후에 하얗게 느껴지는 상태는 3-5년간 지속됩니다.
              
              
                색소가 들어간 주스, 유색소 과일, 카레, 커피, 담배, 탄산음료,
                김치 등은 미백시술 효과를 떨어트릴 수 있습니다.
              
              시술 후 2~3일 동안은 색소가 많은 음식이나 흡연 등을 피해야 효과가
              오래 유지됩니다.
            </p>
          </div>

          <hr className="my-2 mt-[60px] mb-15 mx-5" />
        </div>
        
        <div className="w-full relative">
          <img
            src={dgim}
            alt="dgim"
            className="w-full object-cover h-[500px]"
          />
          <div className="text  absolute inset-0 left-[50%] top-[50%]">
            <p className="text-[24px] line-clamp-15 text-justify">
              구강 질환 조기 발견: 치아 상태를 점검하고, 충치나 잇몸 질환 등
            </p>
            <p className="text-[24px]">
              구강 질환을 조기에 발견하여 치료받을 수 있습니다.
            </p>
          </div>
        </div>
        <div className="max-w-300 mx-auto mt-15 mx-15">
          
          <b className=" flex justify-center md:text-balance text-[24px] mt-[80px] mb-6 mx-5">턱관절치료안내</b>
          <div className="mx-5">
            <p className="text-[24px] line-clamp-15 text-justify">
              턱관절 물리치료에 사용하는 PHL(Perfect Healing Laser) 레이저는
              턱관절 질환으로 인한
           
            
              통증, 염증, 근육 경련 등을 완화하고 세포 재생을 촉진하여 빠른
              회복을 돕는 데 사용됩니다.
            
            
              턱관절 물리치료는 어떻게 하나요? 턱관절 물리치료를 위해 사용되는
              장비로는 PHL-15 레이저가 있습니다.
            </p>

            <img src={intelieo} alt="intelieo" />
            <hr className="my-2 mt-[60px] mb-6 mx-5" />
          </div>
          <dir className="flex  gap-7 mx-5">
            <img src={picture} alt="picture" />
            <div>
              <p className="flex justify-center md:text-balance text-[24px] mt-[80px] mb-6 mx-5">
                <strong>레이저</strong>
              </p>
              <p className="text-[24px] line-clamp-15 text-justify">
                치과 레이저는 잇몸이나 치아 수술, 충치 치료, 지각 과민증 치료 등
                다양한 치과 치료에 사용됩니다
              
                레이저는 치아를 자르거나 잇몸을 절개할 때 열 손상을 최소화하고,
                치료 효과를 높이며, 붓기나 통증을 줄여주는 장점이 있습니다.
              
                잇몸 레이저: 잇몸 수술 시 열 손상을 줄이고 통증과 붓기를
                최소화합니다. 절개, 봉합을 최소화하여 회복이 빠릅니다. 충치
                치료: 물방울 레이저를 사용하여 충치 부위를 제거하고, 적은
                통증으로 치료가 가능합니다. 지각 과민증: 치아 표면에 레이저를
                조사하여 지각 과민증을 완화합니다.
              </p>
            </div>
          </dir>
         
        </div>

        <div className="w-full relative my-2 mt-[60px] mb-6 mx-5" >
          <img src={chair} alt="chair" className="w-full object-cover h-[px]" />
          <div className="text  absolute inset-0 left-[50%] top-[50%]">
            <p className="text-[24px] ">
              치주 질환: 치주 질환 치료 시 잇몸을 절개하지 않고, 레이저를
              사용하여 치주낭을 제거하고 잇몸을 재생시킵니다.
            </p>
            <p className="text-[24px]">
              레이저 스케일링: 물방울 레이저를 사용하여 치석을 제거하고, 치아
              표면을 윤택하게 합니다.
            </p>
            <p className="text-[24px]">
              임플란트: 임플란트 수술 시 레이저를 사용하여 잇몸을 자극하고,
              임플란트 주위염을 예방합니다.
            </p>
          </div>
        </div>

        <div className="max-w-300 mx-auto">
          <hr className="my-2 mt-[60px] mb-6 mx-5" />
          <div>
            <p className="text-center mt-23 mb-8 text-[24px]" mx-5>장비와 시스템</p>
            <div className="flex justify-center gap-2 mb-10 mx-5">
              <img src={dental2} alt="denta2" />
              <img src={dentall} alt="dentall" />
              <img src={dental3} alt="dental3" />
              <img src={dental4} alt="dental4" />
            </div>
            <p className="text-center mt-23 mb-8 text-[24px]">

              치아 교정 시스템
            </p>
            <div className="flex justify-center gap-2 mb-15 mx-5">
              <img src={dental5} alt="dental5" />
              <img src={dental6} alt="dental6" />
              <img src={dental7} alt="dental7" />
              <img src={dental8} alt="dental8" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TreatmentInfo_4;
