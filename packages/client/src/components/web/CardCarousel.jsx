import React from 'react';
import Carousel from './Carousel';

function CardCarousel({ children, images, CN, CCN }) {
  return (
    <div className={CCN}>
      <div className="flex-1">{children}</div>
      <div className="flex-shrink-0 flex-1 rounded-2xl overflow-hidden">
        <Carousel images={images} CN={CN} />
      </div>
    </div>
  );
}

export default CardCarousel;
