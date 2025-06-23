// src/components/web/Button.jsx
import React from 'react';
import PropTypes from 'prop-types'; // PropTypes를 임포트하여 prop 타입 검증

const Button = ({
  children,
  variant = 'primary', // 기본값: primary
  size = 'md', // 기본값: md
  onClick,
  disabled = false,
  className = '', // 추가적인 Tailwind CSS 클래스를 위한 prop
  ...props // 나머지 HTML 속성 (type, aria-label 등)
}) => {
  // 1. variant에 따른 기본 스타일 정의
  const baseStyles =
    'font-medium rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500',
    secondary:
      'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-400',
    outline:
      'border border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus:ring-blue-500',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500',
    ghost:
      'bg-transparent text-gray-800 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300',
    // 필요에 따라 더 많은 variant 추가
  };

  // 2. size에 따른 패딩 및 폰트 크기 정의
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2', // 아이콘 버튼을 위한 특별한 크기 (예: 정사각형 버튼)
    // 필요에 따라 더 많은 size 추가
  };

  // 3. disabled 상태 스타일
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  // 모든 클래스를 결합
  const buttonClasses = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabledStyles,
    className, // 사용자가 추가한 클래스
  ]
    .filter(Boolean)
    .join(' '); // 빈 문자열 제거 후 공백으로 연결

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props} // 나머지 props (예: type="submit", aria-label 등) 전달
    >
      {children}
    </button>
  );
};

// Prop 타입 검증 (선택 사항이지만 권장)
Button.propTypes = {
  children: PropTypes.node.isRequired, // 버튼 내부에 표시될 내용 (텍스트, 아이콘 등)
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'outline',
    'danger',
    'ghost',
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'icon']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;
