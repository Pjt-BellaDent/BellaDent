// src/components/web/Card.jsx
import React from 'react';
import ScrollFadeIn from './ScrollFadeIn';

function Card({ children, image, CN, Scroll }) {
  return (
    <div className={CN}>
      <div className='flex-1'>{children}</div>
      <div className="flex-shrink-0 flex-1">
        {Scroll === true ? (
          <ScrollFadeIn delay={0.2}>
            <img src={image} alt={image} className="block rounded-xl" />
          </ScrollFadeIn>
        ) : (
          <img src={image} alt={image} className="block rounded-xl" />
        )}
      </div>
    </div>
  );
}

export default Card;
