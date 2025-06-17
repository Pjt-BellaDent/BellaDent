import { useState, useEffect } from 'react';

function Carousel({ images, CN }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div
        className={`flex transition-transform duration-1000 ease-in-out ${CN}`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, i) => (
          <img
            key={i}
            src={image}
            alt={`carousel-${i}`}
            className="w-full object-cover flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
