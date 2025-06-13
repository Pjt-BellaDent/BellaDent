import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import NoticeModal from './NoticeModal';

const NoticeWrapper = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const todayKey = new Date().toISOString().split('T')[0];

  // ✅ 오늘 처음 방문 시 자동 표시
  useEffect(() => {
    const skipDate = sessionStorage.getItem('noticeSkipDate');
    if (skipDate !== todayKey) {
      setShow(true);
    }
  }, []);

  // ✅ 외부에서 다시 열 수 있도록 ref 등록
  useImperativeHandle(ref, () => ({
    open: () => setShow(true),
  }));

  return (
    <NoticeModal
      show={show}
      onClose={() => setShow(false)}
      onSkipToday={() => {
        sessionStorage.setItem('noticeSkipDate', todayKey);
        setShow(false);
        console.log('✅ 오늘은 다시 보지 않기 적용됨');
      }}
    />
  );
});

export default NoticeWrapper;
