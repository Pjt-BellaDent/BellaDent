import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import NoticeModal from './NoticeModal';

const NoticeWrapper = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const [notices, setNotices] = useState([]);

  const todayKey = new Date().toISOString().split('T')[0];

  // ✅ 처음 진입 시 자동 표시 (단 오늘 처음일 때만)
  useEffect(() => {
    const skipDate = sessionStorage.getItem('noticeSkipDate');
    if (skipDate !== todayKey) {
      setShow(true);
    }
  }, []);

  // ✅ GET
  useEffect(() => {
    axios.get('http://localhost:3000/api/notice')
      .then(res => setNotices(res.data))
      .catch(err => console.error('공지 불러오기 실패:', err));
  }, []);

  // ✅ POST 저장
  const handleAdd = (newList) => {
    console.log('📤 전달된 공지 목록:', newList);
    setNotices(newList);
    axios.post('http://localhost:3000/api/notice', newList)
      .then(res => console.log('✅ 공지 저장 완료', res.data))
      .catch(err => console.error('❌ 저장 실패', err));
  };

  // ✅ 삭제
  const handleDelete = (index) => {
    const updated = notices.filter((_, i) => i !== index);
    setNotices(updated);
    axios.post('http://localhost:3000/api/notice', updated)
      .then(() => console.log('✅ 공지 삭제 완료'))
      .catch(err => console.error('❌ 삭제 실패', err));
  };

  // ✅ 외부에서 다시 열 수 있도록 ref 연결
  useImperativeHandle(ref, () => ({
    open: () => setShow(true)
  }));

  return (
    <NoticeModal
      show={show}
      onClose={() => setShow(false)} // ⛔ 이건 닫기만, 다시 열 수 있음
      notices={notices}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onSkipToday={() => {
        sessionStorage.setItem('noticeSkipDate', todayKey); // ✅ 오늘 숨김
        setShow(false);
        console.log('✅ 오늘은 다시 보지 않기 적용');
      }}
    />
  );
});

export default NoticeWrapper;
