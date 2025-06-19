import React from 'react';

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
          <button
            className="flex-1 w-full px-6 py-3 text-lg rounded bg-BD-CharcoalBlack text-BD-ElegantGold hover:bg-BD-ElegantGold hover:text-BD-CharcoalBlack duration-300 cursor-pointer"
            onClick={handleClick}
          >
            확인
          </button>
          {activeClose && (
            <button
              className="flex-1 w-full px-6 py-3 rounded text-lg bg-BD-SoftGrayLine text-BD-CoolGray hover:bg-BD-CancelGrayHover hover:text-BD-CharcoalBlack duration-300 cursor-pointer"
              onClick={handleClose}
            >
              취소
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
