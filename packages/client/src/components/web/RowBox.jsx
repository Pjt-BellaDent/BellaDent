import React from 'react';

function RowBox({ children, CN }) {
  return <div className={`w-full flex ${CN}`}>{children}</div>;
}

export default RowBox;
