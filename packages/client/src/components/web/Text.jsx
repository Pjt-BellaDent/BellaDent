import React from 'react';

function Text({ children, CN }) {
  return (
    <>
      <p className={CN}>{children}</p>
    </>
  );
}

export default Text;
