import React from 'react';

function Title({ children, CN }) {
  return (
    <>
      <h3 className={CN}>{children}</h3>
    </>
  );
}

export default Title;
