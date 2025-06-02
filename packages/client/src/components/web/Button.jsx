import React from 'react';

function Button({ children, CN, CLICK }) {
  return (
    <div>
      <button type="button" className={CN} onClick={CLICK}>
        {children}
      </button>
    </div>
  );
}

export default Button;
