import React from 'react';
import Button from './Button';

const Modal = ({ children, show, setShow, activeClick, activeClose }) => {
  const handleClick = () => {
    if (activeClick) activeClick();
    setShow(false);
  };

  const handleClose = () => {
    if (activeClose) activeClose();
    setShow(false);
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full items-center justify-center z-50 bg-neutral-950/60 font-BD-sans"
      style={{ display: show ? 'flex' : 'none' }}
    >
      <div className="bg-BD-PureWhite px-20 py-15 max-w-200 min-w-120 max-h-[80vh] overflow-y-auto shadow-xl text-lg ">
        {children}
        <div className="mt-20 flex justify-center gap-4">
          <Button
            variant="primary" // 기본 primary 스타일
            size="lg" // 큰 사이즈
            className="flex-1 w-full"
            onClick={handleClick}
          >
            확인
          </Button>
          {activeClose && (
            <Button
              variant="secondary" // 보조 secondary 스타일
              size="lg" // 큰 사이즈
              className="flex-1 w-full"
              onClick={handleClose}
            >
              취소
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
