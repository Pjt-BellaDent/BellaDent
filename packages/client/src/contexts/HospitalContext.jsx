// src/contexts/HospitalContext.jsx 
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  getHospitalInfo,
  updateHospitalInfo as updateHospitalInfoApi,
} from '../api/hospital.js';

const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
  const [hospitalInfoState, setHospitalInfoState] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHospitalInfo = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getHospitalInfo();
      setHospitalInfoState(response.data);
    } catch (error) {
      console.error('Failed to fetch hospital information:', error);
      alert('Failed to load hospital information.');
      setHospitalInfoState({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHospitalInfo();
  }, [fetchHospitalInfo]);

  const updateHospitalInfo = useCallback(async (newInfo) => {
    setLoading(true);
    try {
      await updateHospitalInfoApi(newInfo);

      setHospitalInfoState(newInfo);
      console.log('Hospital information successfully updated:', newInfo);
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to update hospital information:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Failed to update hospital information.';
      alert(errorMessage);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    hospitalInfo: hospitalInfoState,
    loading,
    fetchHospitalInfo,
    setHospitalInfo: updateHospitalInfo,
  };

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospitalInfo = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospitalInfo must be used within a HospitalProvider');
  }
  return context;
};
