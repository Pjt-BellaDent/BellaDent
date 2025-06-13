import React from 'react';
import ScrollFadeIn from './ScrollFadeIn';

function Card({ children, image, CN, Scroll }) {
  return (
    <div className={CN}>
      <div>{children}</div>
      <div className="flex-shrink-0">
        {Scroll === true ? (
          <ScrollFadeIn delay={0.2}>
            <img src={image} alt={image} className="block rounded-4xl" />
          </ScrollFadeIn>
        ) : (
          <img src={image} alt={image} className="block rounded-4xl" />
        )}
      </div>
    </div>
  );
}

export default Card;
