// src/components/web/ImageBox.jsx
import React from 'react';

function ImageBox({ images, CN, CCN, setThumbnail }) {
  return (
    <div className={CCN}>
      {images.map((image, i) => (
        <div className={CN} key={i}>
          <img
            src={image}
            alt={image}
            onClick={() => setThumbnail(image)}
            className="object-cover rounded-xl"
          />
        </div>
      ))}
    </div>
  );
}

export default ImageBox;