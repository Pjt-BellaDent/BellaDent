import React, { createContext, useContext, useState } from 'react';

const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
  const [hospitalInfo, setHospitalInfo] = useState(() => {
    const saved = localStorage.getItem('hospitalInfo');
    return saved
      ? JSON.parse(saved)
      : {
          name: '벨라덴치과',
          address: '광주광역시 남구 봉선중앙로 102, 벨라메디타워 4층',
          ceo: '이서윤',
          bizNumber: '847-12-34567',
          phone: '062-987-6543',
        };
  });

  return (
    <HospitalContext.Provider value={{ hospitalInfo, setHospitalInfo }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospitalInfo = () => useContext(HospitalContext);
