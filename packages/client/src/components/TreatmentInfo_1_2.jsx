import React from 'react';

import smile from '../assets/smile.png';
function TreatmentInfo_1_1() {
  return (
    <div className="relative">
      <img src={smile} alt="smile" className="w-full h-[940px] object-cover" />
      <div className="text  absolute inset-0 left-[50%] top-[50%]">
        <p className="text-[18px] mb-4 text-white">
          예쁜미소+아름다운모습+치아+백색치아
        </p>
        <p className="text-[18px] mb-4 text-white">
          하얀 치아와 고른 치열, 시원한 입매, 환한 미소 연예인들의 미소를{' '}
        </p>
        <p className="text-[18px] mb-4 text-white">
          더욱 밝고 매력적으로 만들어주는 데는 '치아'가 정말 중요한 역할을
          합니다.
        </p>
      </div>
    </div>
  );
}

export default TreatmentInfo_1_1;
