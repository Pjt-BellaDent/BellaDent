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
      className="fixed top-0 left-0 w-full h-full items-center justify-center z-50 bg-neutral-950/60"
      style={{ display: show ? 'flex' : 'none' }}
    >
      <div className="bg-white px-20 py-15 rounded-lg max-w-200 min-w-120 max-h-[80vh] overflow-y-auto text-xl ">
        {children}
        <div className="mt-20 flex justify-end">
          <button
            className="flex justify-center rounded-md bg-BD-CharcoalBlack text-BD-ElegantGold outline-2 -outline-offset-2 outline-BD-CharcoalBlack px-6 py-3 shadow-xs hover:bg-BD-ElegantGold  hover-visible:outline-BD-ElegantGold hover:text-BD-CharcoalBlack focus:bg-BD-ElegantGold  focus-visible:outline-BD-ElegantGold focus:text-BD-CharcoalBlack duration-300"
            onClick={handleClick}
          >
            확인
          </button>
          {activeClose && (
            <button
              className="ml-2.5 bg-neutral-600 px-3 py-1.5 rounded-md text-white cursor-pointer"
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
