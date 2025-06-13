import React from 'react';

function ImageBox({ images, CN, setThumbnail }) {
  const handleImageClick = (image) => {
    if (images) {
      setThumbnail(image);
    }
  };

  return (
    <div className={CN}>
      {images.map((image, i) => (
        <img
          src={image}
          alt={image}
          key={i}
          onClick={handleImageClick}
          className="object-cover rounded-2xl"
        />
      ))}
    </div>
  );
}

export default ImageBox;
