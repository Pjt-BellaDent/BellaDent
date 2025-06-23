// src/components/web/Title.jsx
import React from 'react';

// 'as' prop을 추가하여 렌더링될 HTML 태그를 지정할 수 있게 합니다.
// 'size' prop을 추가하여 미리 정의된 폰트 크기를 적용할 수 있게 합니다.
function Title({ children, CN, as: Component = 'h3', size = 'default' }) {
  let fontSizeClass = '';
  let fontWeightClass = 'font-bold'; // 기본 굵기 설정

  switch (size) {
    case 'xl': // 가장 큰 제목
      fontSizeClass = 'text-5xl md:text-6xl'; // 반응형 고려
      break;
    case 'lg': // 큰 제목
      fontSizeClass = 'text-4xl md:text-5xl';
      break;
    case 'md': // 중간 제목 (기본값)
      fontSizeClass = 'text-3xl md:text-4xl';
      break;
    case 'sm': // 작은 제목
      fontSizeClass = 'text-2xl md:text-3xl';
      break;
    case 'xs': // 아주 작은 제목
      fontSizeClass = 'text-xl md:text-2xl';
      break;
    default: // 기본값 (md와 동일하게)
      fontSizeClass = 'text-3xl md:text-4xl';
      break;
  }

  return (
    <Component className={`${fontSizeClass} ${fontWeightClass} ${CN}`}>
      {children}
    </Component>
  );
}

export default Title;
