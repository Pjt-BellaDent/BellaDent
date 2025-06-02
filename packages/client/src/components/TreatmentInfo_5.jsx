import React from 'react';
import dentistry from '../assets/dentistry.png';
import miso from '../assets/miso.png';
import miso1 from '../assets/miso1.png';
import miso2 from '../assets/miso2.png';

function TreatmentInfo_5() {
  return (
    <>
      <div className="relative">
        <img
          src={dentistry}
          alt="dentistry"
          className="w-full h-50 object-cover"
        />
        <p className="absolute left-[50%] top-[50%] -translate-[50%] text-white text-shadow-lg/20">
          <b>미백/라미네이트</b>
        </p>
      </div>
      <div className="max-w-300 mx-auto mb-15">
        <header className="text-center mt-3 mx-30">
          <b>하얀치아 미백/라미네이트</b>
        </header>
        <p className="text-center mt-6 mb-3" mx-5>
          미백 / 라미네이트
        </p>
        <div className="flex justify-center gap-2 mx-5">
          <div className="flex flex-col flex-1">
            <img src={miso} alt="miso" className="w-full" />
            <h3 className="text-center  mt-6 mb-3">미백 치료 효과</h3>
            <p>
              미백 치료는 치아 색을 밝히는 효과가 있습니다 미백 효과는 개인의
              치아 상태나 변색 정도에 따라 다를 수 있습니다.
              <p> 미백 효과는 3~5년 정도 유지될 수 있습니다.</p>
            </p>
          </div>
          <div className="flex flex-col flex-1">
            <img src={miso1} alt="miso1" className="w-full" />
            <h3 className="text-center  mt-6 mb-3">레이저 미백</h3>
            <p>
              특수 광선을 이용해 미백제를 활성화시켜 치아 색을 빠르게 밝히는
              방법입니다.
            </p>
          </div>
          <div className="flex flex-col flex-1">
            <img src={miso2} alt="miso2" className="w-full" />
            <h3 className="text-center  mt-6 mb-3">주의사항</h3>
            <p>
              미백 치료 후 잇몸 민감도가 높아질 수 있습니다. 치아의 변색 원인에
              따라 미백 효과가 달라질 수 있습니다. 일부 미백제는 치아 손상이나
              잇몸 염증을 유발할 수 있으므로, 전문가와 상담 후 치료를 진행하는
              것이 좋습니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default TreatmentInfo_5;
