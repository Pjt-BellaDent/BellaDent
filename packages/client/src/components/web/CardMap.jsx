import React from 'react';
import Map from './Map';

function CardMap({ children, CN, markersData, zoom, address }) {
  return (
    <div className={CN}>
      <div className="flex-1">{children}</div>
      <div className="flex-shrink-0 flex-1 rounded-xl overflow-hidden">
        <Map markersData={markersData} zoom={zoom} address={address} />
      </div>
    </div>
  );
}

export default CardMap;
