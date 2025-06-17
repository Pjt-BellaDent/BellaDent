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
      <div className="bg-white p-5 rounded-lg w-150 max-h-[80vh] overflow-y-auto ">
        {children}
        <div className="mt-2.5 flex justify-end">
          <button
            className="bg-green-600 px-3 py-1.5 rounded-md text-white cursor-pointer"
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
