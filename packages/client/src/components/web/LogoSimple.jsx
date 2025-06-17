import React from 'react';

function LogoSimple({ color = "#c8ab7c" }) {
  return (
    <svg
      width="240"
      height="80"
      viewBox="0 0 240 80"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="BellaDent logo simple"
    >
      <style>
        {`
          .logo_title {
            font-family: 'Playfair Display', serif;
            font-size: 48px;
            font-style: italic;
          }
        `}
      </style>
      <text x="50%" y="55" className="logo_title" textAnchor="middle" fill={color}>
        BellaDent
      </text>
    </svg>
  );
};

export default LogoSimple;