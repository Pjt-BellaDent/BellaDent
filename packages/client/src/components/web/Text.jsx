// src/components/web/Text.jsx
import React from 'react';
function Text({ children, CN, as: Component = 'p', size = 'default' }) {
  let fontSizeClass = '';

  switch (size) {
    case 'xl':
      fontSizeClass = 'text-xl md:text-2xl';
      break;
    case 'lg':
      fontSizeClass = 'text-lg md:text-xl';
      break;
    case 'md':
      fontSizeClass = 'text-base md:text-lg';
      break;
    case 'sm':
      fontSizeClass = 'text-sm md:text-base';
      break;
    case 'xs':
      fontSizeClass = 'text-xs md:text-sm';
      break;
    default:
      fontSizeClass = 'text-base md:text-lg';
      break;
  }

  return <Component className={`${fontSizeClass} ${CN}`}>{children}</Component>;
}

export default Text;
