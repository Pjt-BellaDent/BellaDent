import React, { useEffect, useState } from 'react';

const CarouselCardList = ({
  cards = [],
  visibleCount = 3,
  interval = 3000,
  containerWidth = 1280,
  containerHeight = 600,
  CN,
}) => {
  const [groupIndex, setGroupIndex] = useState(0);

  const gap = 16;

  const cardWidth =
    (containerWidth - gap * (visibleCount - 1)) / visibleCount;
  const cardHeight = containerHeight;

  const totalGroups = Math.ceil(cards.length / visibleCount);

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

  const translateX = groupIndex * (cardWidth * visibleCount + gap * visibleCount);

  return (
    <div
      className={`relative overflow-hidden mx-auto ${CN}`}
      style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}
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
            style={{
              width: `${cardWidth}px`,
              height: `${cardHeight}px`,
              flexShrink: 0,
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <img
              src={card}
              alt={card}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        ))}
      </div>

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