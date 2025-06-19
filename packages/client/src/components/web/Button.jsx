import React from 'react';

function Button({ children, CN, CLICK }) {
  return (
    <>
      <button type="button" className={`text-lg ${CN}`} onClick={CLICK}>
        {children}
      </button>
    </>
  );
}

export default Button;
