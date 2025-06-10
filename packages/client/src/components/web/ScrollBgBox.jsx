import React from 'react';

function ScrollBgBox({ children, CN, url }) {
  return (
    <div className={CN} style={{ backgroundImage: `url(${url})` }}>
      {children}
    </div>
  );
}

export default ScrollBgBox;
