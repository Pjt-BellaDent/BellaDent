import React from 'react';

function Container({ children, CN }) {
  return (
    <div className='w-full bg-white'>
      <div className={`max-w-300 mx-auto ${CN}`}>{children}</div>
    </div>
  );
}

export default Container;
