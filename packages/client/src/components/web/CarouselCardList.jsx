import React, { useEffect, useRef, useState } from 'react';

const CarouselCardList = ({
  cards = [],
  visibleCount = 3,
  interval = 3000,
  containerWidth = 1200,
  CN,
}) => {
  const [cardWidth, setCardWidth] = useState(0);
  const [groupIndex, setGroupIndex] = useState(0);
  const cardRef = useRef(null);

  const totalGroups = Math.ceil(cards.length / visibleCount);

  useEffect(() => {
    if (cardRef.current) {
      const img = cardRef.current.querySelector('img');
      const handleImageLoad = () => {
        const width = img.offsetWidth;
        if (width > 0) setCardWidth(width);
      };

      if (img.complete) {
        handleImageLoad();
      } else {
        img.onload = handleImageLoad;
      }
    }
  }, [cards]);

  const autoSlide = () => {
    setGroupIndex((prev) => (prev + 1) % totalGroups);
  };

  useEffect(() => {
    const timer = setInterval(autoSlide, interval);
    return () => clearInterval(timer);
  }, [interval, totalGroups]);

  const slideTo = (index) => {
    if (index < 0) index = totalGroups - 1;
    if (index >= totalGroups) index = 0;
    setGroupIndex(index);
  };

  // 🧠 자동 계산된 gap
  const gap =
    visibleCount > 1
      ? (containerWidth - cardWidth * visibleCount) / (visibleCount - 1)
      : 0;

  const translateX = groupIndex * ((cardWidth + gap) * visibleCount);

  return (
    <div
      className={`relative overflow-hidden mx-auto ${CN}`}
      style={{ width: `${containerWidth}px` }}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${translateX}px)`,
          columnGap: `${gap}px`,
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            ref={index === 0 ? cardRef : null}
            className="flex-shrink-0"
          >
            <img src={card} alt={card} className="block" />
          </div>
        ))}
      </div>

      {/* 버튼 */}
      <button
        onClick={() => slideTo(groupIndex - 1)}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded"
      >
        ◀
      </button>
      <button
        onClick={() => slideTo(groupIndex + 1)}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded"
      >
        ▶
      </button>
    </div>
  );
};

export default CarouselCardList;
