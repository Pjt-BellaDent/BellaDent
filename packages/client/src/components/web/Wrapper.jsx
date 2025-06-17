import React from 'react';

function Wrapper({ children, CN, BG }) {
  return (
    <div className={`w-full ${BG}`}>
      <div className={`max-w-332 mx-auto ${CN}`}>{children}</div>
    </div>
  );
}

export default Wrapper;
