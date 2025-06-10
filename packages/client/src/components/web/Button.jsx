import React from 'react';

function Button({ children, CN, CLICK }) {
  return (
    <>
      <button type="button" className={CN} onClick={CLICK}>
        {children}
      </button>
    </>
  );
}

export default Button;
