// src/components/web/Container.jsx
import React from 'react';

function Container({ children, CN, BG }) {
  return (
    <div className={`w-full ${BG}`}>
      <div className={`max-w-320 mx-auto ${CN}`}>{children}</div>
    </div>
  );
}

export default Container;
