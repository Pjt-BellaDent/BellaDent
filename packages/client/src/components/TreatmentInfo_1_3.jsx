import React from 'react';
import ch1 from '../assets/ch1.png';
import ch from '../assets/ch.png';
import sim from '../assets/sim.png';
import siml from '../assets/siml.png';
import sm from '../assets/sm.png';
import smi from '../assets/smi.png';
import laugh from '../assets/laugh.png';
import laug from '../assets/laug.png';

function TreatmentInfo_1_3() {
  return (
    <div>
      <h3 className="text-center mt-[108px] mx-30 text-[48px]">
        <b>하얀치아 예쁜미소</b>
      </h3>
      <hr className="max-w-300 mx-auto mt-4.5" />

      <p className="text-center mt-23 mb-8 text-[24px] mx-5">하얀 치아 교정</p>
      <div className="flex justify-center gap-2 mx-5">
        <img src={ch1} alt="ch1" />
        <img src={ch} alt="ch" />
        <img src={sim} alt="sim" />
        <img src={siml} alt="siml" />
      </div>

      <p className="text-center mt-21 mb-8 text-[24px]">하얀 치아 미소</p>

      <div className="flex justify-center gap-2 mb-[165px] mx-5">
        <img src={sm} alt="sm" />
        <img src={smi} alt="smi" />
        <img src={laugh} alt="laugh" />
        <img src={laug} alt="laug" />
      </div>
    </div>
  );
}

export default TreatmentInfo_1_3;
