import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-BD-WarmBeige">
      <h1 className="text-5xl font-bold mb-4 text-BD-ElegantGold">404</h1>
      <p className="text-xl mb-6 text-BD-CharcoalBlack">
        페이지를 찾을 수 없습니다.
      </p>
      <Link
        to="/"
        className="px-6 py-2 rounded bg-BD-ElegantGold text-BD-CharcoalBlack hover:bg-BD-CharcoalBlack hover:text-BD-PureWhite duration-300"
      >
        메인으로 이동
      </Link>
    </div>
  );
}

export default NotFound;
