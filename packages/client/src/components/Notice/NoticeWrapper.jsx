// src/components/Notice/NoticeWrapper.jsx
import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import NoticeModal from './NoticeModal';

const NoticeWrapper = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const todayKey = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const skipDate = sessionStorage.getItem('noticeSkipDate');
    if (skipDate !== todayKey) {
      setShow(true);
    }
  }, []);

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
      }}
    />
  );
});

export default NoticeWrapper;
