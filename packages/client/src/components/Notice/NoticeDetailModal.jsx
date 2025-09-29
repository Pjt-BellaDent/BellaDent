// src/components/Notice/NoticeDetailModal.jsx
import React from 'react';

const NoticeDetailModal = ({ show, notice, onClose, onEdit, onDelete }) => {
  if (!show || !notice) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 bg-black/40 flex items-center justify-center z-[1100] ${
        show ? 'flex' : 'hidden'
      }`}
      onClick={onClose}
    >
      <div
        className="bg-BD-PureWhite rounded-lg p-6 w-full max-w-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-BD-CoolGray hover:text-BD-CharcoalBlack text-2xl"
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>
        <h3 className="text-xl font-bold mb-3 text-BD-CharcoalBlack">
          {notice.title}
        </h3>
        <div className="text-sm text-BD-CoolGray mb-4">
          작성자: {notice.author || '알 수 없음'} | 작성일:{' '}
          {notice.timestamp
            ? new Date(notice.timestamp).toLocaleString()
            : '날짜 정보 없음'}
        </div>
        <div className="text-base text-BD-CharcoalBlack mb-6 whitespace-pre-wrap">
          {notice.body}
        </div>
        <div className="flex justify-end gap-2">
          {onEdit && (
            <button
              className="px-4 py-2 bg-BD-ElegantGold text-BD-CharcoalBlack rounded-md hover:bg-BD-CharcoalBlack hover:text-BD-PureWhite transition-colors text-sm"
              onClick={() => onEdit(notice)}
            >
              수정
            </button>
          )}

          {onDelete && (
            <button
              className="px-4 py-2 bg-BD-DangerRed text-BD-PureWhite rounded-md hover:bg-BD-DangerRedDark transition-colors text-sm"
              onClick={() => onDelete(notice.id)}
            >
              삭제
            </button>
          )}

          <button
            className="px-4 py-2 bg-BD-CoolGray text-BD-PureWhite rounded-md hover:bg-BD-CancelGrayHover transition-colors text-sm"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailModal;
