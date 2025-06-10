import React from 'react';
import { useHospitalInfo } from '../contexts/HospitalContext';

function Footer() {
  const { hospitalInfo } = useHospitalInfo();

  return (
    <footer className="w-full h-50 bg-gray-500 flex-shrink-0 flex-grow-0">
      <div className="max-w-360 h-full mx-auto flex flex-col justify-center items-center text-white">
        <h3 className="mb-4 text-xl">{hospitalInfo.name}</h3>
        <p className="my-1">
          주소: {hospitalInfo.address} | 대표자명: {hospitalInfo.ceo} | 사업자등록번호: {hospitalInfo.bizNumber}
        </p>
        <p className="my-1">
          Tel: {hospitalInfo.phone} | Copyright ⓒ 2025 {hospitalInfo.name}. All rights reserved.
        </p>
        <p className="mt-5">Marketing Management By team A</p>
      </div>
    </footer>
  );
}

export default Footer;
