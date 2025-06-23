import React from 'react';

const NoticeDetailModal = ({ show, notice, onClose, onEdit, onDelete }) => {
  if (!show || !notice) {
    return null;
  }

  return (
    // --- 오버레이 (Overlay) 부분 ---

    <div
      className={`fixed inset-0 bg-black/40 flex items-center justify-center z-[1100] ${
        show ? 'flex' : 'hidden'
      }`}
      onClick={onClose} // 오버레이 클릭 시 모달 닫기
    >
      {/* --- 모달 박스 (ModalBox) 부분 --- */}
      <div
        className="bg-BD-PureWhite rounded-lg p-6 w-full max-w-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {' '}
        {/* 모달 박스 내부 클릭 시 오버레이 닫힘 방지 */}
        <button
          className="absolute top-3 right-3 text-BD-CoolGray hover:text-BD-CharcoalBlack text-2xl"
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>
        {/* --- 제목 (Title) 부분 --- */}
        <h3 className="text-xl font-bold mb-3 text-BD-CharcoalBlack">
          {notice.title}
        </h3>
        {/* --- 메타 정보 (Meta) 부분 --- */}
        <div className="text-sm text-BD-CoolGray mb-4">
          작성자: {notice.author || '알 수 없음'} | 작성일:{' '}
          {notice.timestamp
            ? new Date(notice.timestamp).toLocaleString()
            : '날짜 정보 없음'}
        </div>
        {/* --- 내용 (Content) 부분 --- */}
        <div className="text-base text-BD-CharcoalBlack mb-6 whitespace-pre-wrap">
          {notice.body}
        </div>
        {/* --- 버튼 그룹 (ButtonRow) 부분 --- */}
        <div className="flex justify-end gap-2">
          {/* --- 수정 버튼 --- */}
          {onEdit && (
            <button
              className="px-4 py-2 bg-BD-ElegantGold text-BD-CharcoalBlack rounded-md hover:bg-BD-CharcoalBlack hover:text-BD-PureWhite transition-colors text-sm"
              onClick={() => onEdit(notice)} // 클릭 시 onEdit 핸들러 호출, 현재 notice 객체 전달
            >
              수정
            </button>
          )}

          {/* --- 삭제 버튼 --- */}
          {onDelete && (
            <button
              className="px-4 py-2 bg-BD-DangerRed text-BD-PureWhite rounded-md hover:bg-BD-DangerRedDark transition-colors text-sm"
              onClick={() => onDelete(notice.id)} // 클릭 시 onDelete 핸들러 호출, notice ID 전달
            >
              삭제
            </button>
          )}

          {/* --- 닫기 버튼 --- */}
          <button
            className="px-4 py-2 bg-BD-CoolGray text-BD-PureWhite rounded-md hover:bg-BD-CancelGrayHover transition-colors text-sm"
            onClick={onClose} // 클릭 시 onClose 핸들러 호출
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailModal;
