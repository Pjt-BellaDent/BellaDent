import React from 'react'
import ch1 from '../assets/ch1.png';
import ch from '../assets/ch.png';
import sim from '../assets/sim.png';
import siml from '../assets/siml.png';
import sm from '../assets/sm.png';
import smi from '../assets/smi.png';
import laugh from '../assets/laugh.png';
import laug from '../assets/laug.png';
import "./TreatmentInfo_1.css"
function TreatmentInfo_1_3() {
  return (
    <div>
    
    <header>하얀치아 예쁜미소</header>
   
     
      <p className='text-center'>Lorem ipsum dolor sit amet.</p>
         <div className="review d-flex gap-2">
           <img src={ch1} alt="ch1" />;
           <img src={ch} alt="ch"  />;
           <img src={sim} alt="sim"  />;
           <img src={siml} alt="siml" />;
         </div>
        
         <p className='text-center'>Lorem ipsum dolor sit amet.</p>
       
         <div className="review d-flex gap-2">
           <img src={sm} alt="sm" />;
           <img src={smi} alt="smi" />;
           <img src={laugh} alt="laugh" />;
           <img src={laug} alt="laug" />;
         </div>
         
        
      </div>
   
 
  )
}


export default TreatmentInfo_1_3