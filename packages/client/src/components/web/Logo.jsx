import React from 'react';

const Logo = () => {
  return (
    <svg
      width="240"
      height="120"
      viewBox="0 0 240 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="BellaDent logo"
    >
      <style>
        {`
          .title {
            font-family: 'Playfair Display', serif;
            font-size: 48px;
            font-style: italic;
          }
          .subtitle {
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
        `}
      </style>
      <text x="50%" y="60" className="title" textAnchor="middle" fill="#C8AB7C">
        BellaDent
      </text>
      <text
        x="50%"
        y="95"
        className="subtitle"
        textAnchor="middle"
        fill="#888888"
      >
        Premium Dental Care
      </text>
    </svg>
  );
};

export default Logo;
