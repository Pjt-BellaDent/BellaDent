import React from 'react';
import ReservationManager from './ReservationManager';

const ReservationsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📅 예약 관리</h1>
      <ReservationManager />
    </div>
  );
};

export default ReservationsPage;
