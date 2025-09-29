// src/components/web/Title.jsx
import React from 'react';
function Title({ children, CN, as: Component = 'h3', size = 'default' }) {
  let fontSizeClass = '';
  let fontWeightClass = 'font-bold';

  switch (size) {
    case 'xl':
      fontSizeClass = 'text-5xl md:text-6xl';
      break;
    case 'lg':
      fontSizeClass = 'text-4xl md:text-5xl';
      break;
    case 'md':
      fontSizeClass = 'text-3xl md:text-4xl';
      break;
    case 'sm':
      fontSizeClass = 'text-2xl md:text-3xl';
      break;
    case 'xs':
      fontSizeClass = 'text-xl md:text-2xl';
      break;
    default:
      fontSizeClass = 'text-xl md:text-2xl';
      break;
  }

  return (
    <Component className={`${fontSizeClass} ${fontWeightClass} ${CN}`}>
      {children}
    </Component>
  );
}

export default Title;
