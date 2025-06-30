import { useEffect, useState } from 'react';
import axios from '../../libs/axiosInstance';
import { getAuth } from 'firebase/auth';
import NoticeDetailModal from './NoticeDetailModal';

const NoticeModal = ({ show, onClose, onSkipToday }) => {
  const [notices, setNotices] = useState([]);
  const [detailShow, setDetailShow] = useState(false);
  const [detailNotice, setDetailNotice] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [showOnMain, setShowOnMain] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const baseURL = '/notices';

  const fetchNotices = async () => {
    try {
      const res = await axios.get(baseURL);
      setNotices(res.data.notices || []);
    } catch (err) {
      alert('공지사항 불러오기 실패');
      setNotices([]);
    }
  };

  useEffect(() => {
    if (show) fetchNotices();
  }, [show]);

  const resetForm = () => {
    setTitle('');
    setBody('');
    setShowOnMain(false);
    setDetailNotice(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      alert('제목과 내용을 입력하세요.');
      return;
    }

    try {
      const user = getAuth().currentUser;

      const data = editId
        ? { title, content: body, isPublic: !!showOnMain }
        : { title, content: body, authorId: user.uid, isPublic: !!showOnMain };

      if (editId) {
        await axios.put(`${baseURL}/${editId}`, data);
      } else {
        await axios.post(baseURL, data);
      }

      setEditId(null);
      resetForm();
      setShowForm(false);
      fetchNotices();
    } catch (err) {
      console.error('공지 저장 실패:', err.response?.data || err.message);
      alert('저장 실패');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
      setDetailShow(false);
      fetchNotices();
    } catch (err) {
      alert('삭제 실패');
    }
  };

  const openDetailModal = (notice) => {
    setDetailNotice(notice);
    setDetailShow(true);
  };

  const handleStartEdit = (notice) => {
    setEditId(notice.id);
    setTitle(notice.title);
    setBody(notice.content);
    setShowOnMain(Boolean(notice.isPublic));
    setShowForm(true);
    setDetailShow(false);
  };

  const totalPages = Math.ceil(notices.length / itemsPerPage);
  const visibleNotices = notices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div
            className="bg-white p-5 rounded-lg w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold flex items-center gap-2 mb-5">
              📢 직원 공지사항
            </h3>

            <ul>
              {!showForm &&
                (visibleNotices.length > 0 ? (
                  visibleNotices.map((n) => (
                    <li
                      key={n.id}
                      onClick={() => openDetailModal(n)}
                      className="border-b py-2 cursor-pointer hover:bg-gray-100 transition"
                    >
                      <strong>{n.title}</strong>
                    </li>
                  ))
                ) : (
                  <div className="text-center text-gray-500 my-5 text-sm">
                    공지사항이 없습니다.
                  </div>
                ))}

              {showForm && (
                <li>
                  <input
                    type="text"
                    placeholder="제목 입력"
                    className="w-full p-2 mb-2 border rounded text-sm"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                  <textarea
                    placeholder="내용 입력"
                    className="w-full p-2 h-24 border rounded text-sm resize-none"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  ></textarea>
                  <div className="text-xs mt-1">
                    <label>
                      <input
                        type="checkbox"
                        className="mr-1"
                        checked={showOnMain}
                        onChange={(e) => setShowOnMain(e.target.checked)}
                      />
                      홈페이지에 표시
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={handleSubmit}
                      className="bg-green-600 text-white text-sm rounded px-3 py-1 hover:bg-green-700"
                    >
                      {editId ? '수정 완료' : '등록'}
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="bg-gray-600 text-white text-sm rounded px-3 py-1 hover:bg-gray-700"
                    >
                      취소
                    </button>
                  </div>
                </li>
              )}
            </ul>

            {!showForm && totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-1">
                <button
                  className="px-2 py-1 rounded border text-xs"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  이전
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-2 py-1 rounded border text-xs ${
                      currentPage === i + 1
                        ? 'bg-yellow-600 text-white font-bold'
                        : 'bg-gray-200'
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="px-2 py-1 rounded border text-xs"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  다음
                </button>
              </div>
            )}

            {!showForm && (
              <>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="bg-yellow-600 text-white text-sm rounded px-3 py-1 hover:bg-yellow-700"
                    onClick={() => {
                      setEditId(null);
                      resetForm();
                      setShowForm(true);
                    }}
                  >
                    추가
                  </button>
                  <button
                    className="bg-gray-800 text-white text-sm rounded px-3 py-1 hover:bg-gray-900"
                    onClick={onClose}
                  >
                    닫기
                  </button>
                </div>
                <div className="mt-1 text-xs text-right text-gray-600">
                  <label>
                    <input
                      type="checkbox"
                      className="mr-1"
                      onChange={(e) => {
                        if (e.target.checked && onSkipToday) onSkipToday();
                      }}
                    />
                    오늘은 다시 보지 않기
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <NoticeDetailModal
        show={detailShow}
        notice={detailNotice}
        onClose={() => setDetailShow(false)}
        onEdit={handleStartEdit}
        onDelete={() => handleDelete(detailNotice?.id)}
      />
    </>
  );
};

export default NoticeModal;
