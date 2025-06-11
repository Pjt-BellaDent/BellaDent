import React, { useState } from 'react';

const NoticeModal = ({
  show,
  onClose,
  notices,
  onAdd,
  onDelete,
  onEdit,
  title,
  setTitle,
  body,
  setBody,
  showForm,
  setShowForm
}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleSubmit = () => {
    if (!title.trim()) return alert('제목을 입력하세요.');
    onAdd({ title: title.trim(), body: body.trim() });
    setTitle('');
    setBody('');
    setShowForm(false);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-60 z-[1000] ${show ? 'flex' : 'hidden'} items-center justify-center`}>
      <div className="bg-white w-[600px] max-h-[80vh] p-6 rounded-lg overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">📢 직원 공지사항</h3>

        <ul className="mb-4">
          {notices
            .filter(n => n.title?.trim())
            .map((item, i) => (
              <li key={i} className="mb-3 border-b pb-2">
                <div
                  className="font-semibold cursor-pointer"
                  onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                >
                  {item.title}
                </div>
                {expandedIndex === i && (
                  <>
                    <div className="mt-2 text-sm text-gray-600">{item.body}</div>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => onEdit(i)} className="px-3 py-1 rounded bg-yellow-400 text-white">수정</button>
                      <button onClick={() => onDelete(i)} className="px-3 py-1 rounded bg-red-500 text-white">삭제</button>
                    </div>
                  </>
                )}
              </li>
            ))}
        </ul>

        {showForm && (
          <>
            <input
              type="text"
              placeholder="제목 입력 (예: 5월 30일 회의 일정)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded"
            />
            <textarea
              placeholder="내용 입력 (예: 회의는 5월 30일 14시 회의실에서 진행됩니다.)"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded resize-none h-24"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={handleSubmit} className="px-4 py-2 rounded bg-green-600 text-white">등록</button>
              <button
                onClick={() => {
                  setTitle('');
                  setBody('');
                  setShowForm(false);
                }}
                className="px-4 py-2 rounded bg-gray-500 text-white"
              >
                취소
              </button>
            </div>
          </>
        )}

        {!showForm && (
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded bg-blue-600 text-white">추가</button>
            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-800 text-white">닫기</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeModal;
