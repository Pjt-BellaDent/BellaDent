import React from 'react';

function LineImageBanner({ children, CN, image }) {
  return (
    <div className={`relative ${CN}`}>
      <img src={image} alt={image} />
      <div className='absolute -translate-1/2 top-1/2 left-1/2'>{children}</div>
    </div>
  );
}

export default LineImageBanner;
