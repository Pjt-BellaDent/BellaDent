// src/components/web/LineBanner.jsx
import React from 'react';

function LineBanner({ children, CN }) {
  return (
    <div className={CN}>
      {children}
    </div>
  );
}

export default LineBanner;

