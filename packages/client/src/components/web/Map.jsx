import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function Map({ markersData = [], center, zoom, address }) {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const textOverlaysRef = useRef([]);
  const geocoderRef = useRef(null);

  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

  const mapStyles = {
    width: '100%',
    height: '100%',
  };

  function createTextOverlayClass() {
    return class TextOverlay extends window.google.maps.OverlayView {
      constructor(position, content, map) {
        super();
        this.position = position;
        this.content = content;
        this.div = null;
        this.setMap(map);
      }
      onAdd() {
        this.div = document.createElement('div');
        this.div.innerHTML = this.content;
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(this.div);
      }
      draw() {
        if (!this.div) return;
        const projection = this.getProjection();
        if (!projection) return;
        const pixelPosition = projection.fromLatLngToDivPixel(this.position);
        this.div.style.left = `${pixelPosition.x}px`;
        this.div.style.top = `${pixelPosition.y}px`;
      }
      onRemove() {
        if (this.div && this.div.parentNode) {
          this.div.parentNode.removeChild(this.div);
          this.div = null;
        }
      }
    };
  }

  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    loader.load().then(() => {
      if (mapElementRef.current && window.google && window.google.maps) {
        try {
          mapInstanceRef.current = new window.google.maps.Map(
            mapElementRef.current,
            {
              center: center || { lat: 37.5665, lng: 126.978 },
              zoom: zoom || 14,
            }
          );
          geocoderRef.current = new window.google.maps.Geocoder();
          setIsMapLoading(false);
          setMapError(null);
        } catch (initError) {
          setMapError('지도 초기화 중 오류가 발생했습니다.');
          setIsMapLoading(false);
        }
      }
    }).catch(() => {
      setMapError('지도 스크립트 로드에 실패했습니다. API 키 또는 네트워크 상태를 확인해주세요.');
      setIsMapLoading(false);
    });

    return () => {
      if (mapInstanceRef.current) mapInstanceRef.current = null;
      textOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
      textOverlaysRef.current = [];
    };
  }, [center, zoom]);

  useEffect(() => {
    if (
      !mapInstanceRef.current ||
      !window.google ||
      !window.google.maps ||
      !geocoderRef.current
    )
      return;

    const TextOverlay = createTextOverlayClass();

    textOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    textOverlaysRef.current = [];

    if (markersData && markersData.length > 0) {
      markersData.forEach((markerData) => {
        if (
          typeof markerData.latitude === 'number' &&
          typeof markerData.longitude === 'number'
        ) {
          const position = {
            lat: markerData.latitude,
            lng: markerData.longitude,
          };
          const content = `
            <div style="
              position: absolute;
              border: 1px solid #000;
              background-color: #fff;
              padding: .5rem;
              white-space: nowrap;
              transform: translate(-50%, -100%);
              font-size: 1rem;
            ">
              <strong>${markerData.storeName}</strong><br>
              연락처: ${markerData.contact}
            </div>
          `;
          const textOverlay = new TextOverlay(
            new window.google.maps.LatLng(position.lat, position.lng),
            content,
            mapInstanceRef.current
          );
          textOverlaysRef.current.push(textOverlay);
        }
      });
    }
  }, [mapInstanceRef.current, markersData, geocoderRef.current]);

  useEffect(() => {
    if (
      address &&
      address.trim().length > 0 &&
      mapInstanceRef.current &&
      geocoderRef.current
    ) {
      setMapError(null);

      const geocodeOptions = {
        address: address,
        region: 'kr',
      };

      geocoderRef.current.geocode(geocodeOptions, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            const location = results[0].geometry.location;
            mapInstanceRef.current.setCenter(location);
          } else {
            setMapError(`"${address}"에 대한 검색 결과를 찾을 수 없습니다.`);
          }
        } else if (status === window.google.maps.GeocoderStatus.ZERO_RESULTS) {
          setMapError(`"${address}"에 대한 검색 결과를 찾을 수 없습니다.`);
        } else {
          let errorMessage = `주소 검색 중 오류가 발생했습니다. (상태: ${status})`;
          if (status === window.google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            errorMessage =
              '주소 검색 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
          }
          setMapError(errorMessage);
        }
      });
    } else {
      if (!address || address.trim().length === 0) {
        setMapError(null);
      }
    }
  }, [address, mapInstanceRef.current, geocoderRef.current]);

  return (
    <>
      {isMapLoading && <p>지도 로딩 중입니다...</p>}
      {mapError && <p style={{ color: 'red' }}>오류: {mapError}</p>}
      <div ref={mapElementRef} style={mapStyles}></div>
    </>
  );
}

export default Map;