// src/components/web/Text.jsx
import React from 'react';

// 'as' prop을 추가하여 렌더링될 HTML 태그를 지정할 수 있게 합니다.
// 'size' prop을 추가하여 미리 정의된 폰트 크기를 적용할 수 있게 합니다.
function Text({ children, CN, as: Component = 'p', size = 'default' }) {
  let fontSizeClass = '';

  switch (size) {
    case 'xl': // 가장 큰 텍스트
      fontSizeClass = 'text-xl md:text-2xl';
      break;
    case 'lg': // 큰 텍스트
      fontSizeClass = 'text-lg md:text-xl';
      break;
    case 'md': // 중간 텍스트 (기본값)
      fontSizeClass = 'text-base md:text-lg'; // base는 기본 16px
      break;
    case 'sm': // 작은 텍스트
      fontSizeClass = 'text-sm md:text-base';
      break;
    case 'xs': // 아주 작은 텍스트
      fontSizeClass = 'text-xs md:text-sm';
      break;
    default: // 기본값 (md와 동일하게)
      fontSizeClass = 'text-base md:text-lg';
      break;
  }

  return <Component className={`${fontSizeClass} ${CN}`}>{children}</Component>;
}

export default Text;
