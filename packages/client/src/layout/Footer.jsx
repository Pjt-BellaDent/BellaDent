// src/layout/Footer.jsx
import React from 'react';
import { useHospitalInfo } from '../contexts/HospitalContext';
import Logo from '../components/web/Logo.jsx';

function Footer() {
  const { hospitalInfo, loading } = useHospitalInfo();

  if (loading || !hospitalInfo) {
    return null;
  }

  return (
    <footer className="w-full h-30 bg-BD-CharcoalBlack flex-shrink-0 flex-grow-0 text-BD-ElegantGold text-light text-sm font-BD-mont">
      <div className="max-w-360 h-full mx-auto flex flex-col justify-center items-center">
        <Logo />
        <div className="flex items-center gap-4 text-xs">
          <p>주소: {hospitalInfo?.address}</p>
          <p>대표자명: {hospitalInfo?.ceo}</p>
          <p>사업자등록번호: {hospitalInfo?.bizNumber}</p>
          <p>Tel: {hospitalInfo?.phone}</p>
          <p>Copyright ⓒ 2025 {hospitalInfo?.name}. All rights reserved.</p>
        </div>
        <p className="text-md">Marketing Management By team A</p>
      </div>
    </footer>
  );
}

export default Footer;
