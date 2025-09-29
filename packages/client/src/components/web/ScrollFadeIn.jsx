// src/components/web/ScrollFadeIn.jsx
import React, { useEffect, useRef, useState } from 'react';

const ScrollFadeIn = ({ children, delay = 0, duration = 0.8 }) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all ease-out transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1/2'
      }`}
      style={{
        transitionDelay: `${delay}s`,
        transitionDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollFadeIn;
