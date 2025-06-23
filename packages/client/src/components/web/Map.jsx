import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function Map({ markersData = [], center, zoom, address }) {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const textOverlaysRef = useRef([]);
  const geocoderRef = useRef(null);
  const [isMapLoading, setIsMapLoading] = useState(true);

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

  // 첫 번째 useEffect: Google Maps API 로드 및 지도 초기화
  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    });

    loader
      .load()
      .then(() => {
        // API 로드 성공 후 지도 초기화 시도
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
            setIsMapLoading(false); // 지도 로딩 완료
            // setMapError(null); // UI 오류 상태 초기화 코드 제거
            console.info('Google Maps API 로드 및 지도 초기화 완료.'); // 콘솔 로그 추가
          } catch (initError) {
            // 지도 초기화 오류 발생 시 콘솔에만 출력
            console.error('지도 초기화 중 오류가 발생했습니다:', initError);
            setIsMapLoading(false); // 오류가 발생해도 로딩 상태는 종료
          }
        } else {
          // API 로드는 성공했으나 DOM 엘리먼트가 없거나 window.google 객체 문제 시
          console.error(
            '지도 엘리먼트 또는 Google Maps 객체를 찾을 수 없습니다.'
          );
          setIsMapLoading(false);
        }
      })
      .catch((loadError) => {
        // 지도 스크립트 로드 실패 시 콘솔에만 출력
        console.error(
          '지도 스크립트 로드에 실패했습니다. API 키 또는 네트워크 상태를 확인해주세요:',
          loadError
        );
        setIsMapLoading(false); // 스크립트 로드 실패 시 로딩 상태 종료
      });

    // 컴포넌트 언마운트 시 정리 작업
    return () => {
      if (mapInstanceRef.current) mapInstanceRef.current = null;
      // 오버레이 제거
      textOverlaysRef.current.forEach((overlay) => {
        if (overlay && typeof overlay.setMap === 'function') {
          overlay.setMap(null);
        }
      });
      textOverlaysRef.current = [];
    };
  }, [center, zoom, GOOGLE_MAPS_API_KEY]);

  // 두 번째 useEffect: markersData 변경 시 텍스트 오버레이 추가/업데이트
  useEffect(() => {
    // 지도 인스턴스나 geocoder가 준비되지 않았으면 바로 종료
    if (
      !mapInstanceRef.current ||
      !window.google ||
      !window.google.maps ||
      !geocoderRef.current
    ) {
      return;
    }

    const TextOverlay = createTextOverlayClass();

    // 기존 오버레이 제거
    textOverlaysRef.current.forEach((overlay) => {
      if (overlay && typeof overlay.setMap === 'function') {
        overlay.setMap(null);
      }
    });
    textOverlaysRef.current = [];

    // markersData가 유효하고 데이터가 있을 경우 텍스트 오버레이 추가
    if (markersData && Array.isArray(markersData) && markersData.length > 0) {
      markersData.forEach((markerData) => {
        // 위도, 경도 값이 유효한 숫자인지 확인
        if (
          markerData &&
          typeof markerData.latitude === 'number' &&
          typeof markerData.longitude === 'number'
        ) {
          const position = {
            lat: markerData.latitude,
            lng: markerData.longitude,
          };

          const content = `
            <div className="absolute border border-black bg-white p-2 whitespace-nowrap transform -translate-x-1/2 -translate-y-full text-base z-[1] shadow-[2px_2px_5px_rgba(0,0,0,0.3)] pointer-events-none">
              <strong>${markerData.storeName || '이름 없음'}</strong><br> 
              연락처: ${markerData.contact || '정보 없음'} 
            </div>
          `;

          const textOverlay = new TextOverlay(
            new window.google.maps.LatLng(position.lat, position.lng),
            content,
            mapInstanceRef.current
          );
          textOverlaysRef.current.push(textOverlay);
        } else { 
          console.warn('유효하지 않은 마커 데이터가 있습니다:', markerData);
        }
      });
    }
  }, [mapInstanceRef.current, markersData]);

  useEffect(() => {
    // address 값이 유효하고 지도 인스턴스 및 geocoder가 준비되었는지 확인
    if (
      address &&
      address.trim().length > 0 &&
      mapInstanceRef.current &&
      geocoderRef.current
    ) {
      const geocodeOptions = {
        address: address,
        region: 'kr',
      };

      // Geocoder를 사용하여 주소 검색 실행
      geocoderRef.current.geocode(geocodeOptions, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            const location = results[0].geometry.location;
            // 검색 결과의 첫 번째 위치로 지도 중앙 이동
            mapInstanceRef.current.setCenter(location);
            console.info(
              `"${address}" 주소 검색 성공. 지도를 이동합니다.`,
              location.toJSON()
            );
          } else {
            // 검색 결과는 OK지만 결과 배열이 비어있는 경우 (드물지만 가능)
            console.warn(`"${address}"에 대한 검색 결과를 찾을 수 없습니다.`);
          }
        } else if (status === window.google.maps.GeocoderStatus.ZERO_RESULTS) {
          // 검색 결과가 전혀 없는 경우
          console.warn(
            `"${address}"에 대한 검색 결과를 찾을 수 없습니다. (결과 0개)`
          );
        } else {
          // 그 외 Geocoder 오류 발생 시
          let errorMessage = `주소 검색 중 오류가 발생했습니다. (상태 코드: ${status})`;
          if (status === window.google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            errorMessage =
              '주소 검색 사용량 한도를 초과했습니다. Google Cloud 콘솔에서 사용량을 확인해주세요.';
          }
          console.error(errorMessage, { address, status, results });
        }
      });
    } else {
      // address 값이 없거나 비어있는 경우
      if (!address || address.trim().length === 0) {
      }
    }
  }, [address, mapInstanceRef.current, geocoderRef.current]);

  return (
    <>
      {isMapLoading && <p>지도 로딩 중입니다...</p>}
      <div ref={mapElementRef} style={mapStyles}></div>
    </>
  );
}

export default Map;
