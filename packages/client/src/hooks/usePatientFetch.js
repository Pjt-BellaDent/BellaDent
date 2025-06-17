// src/hooks/usePatientFetch.js
import { useEffect, useState } from 'react';
import { fetchAllPatients } from '@/api/patients';

const usePatientFetch = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = async () => {
    setLoading(true);
    try {
      const data = await fetchAllPatients();
      setPatients(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  return {
    patients,
    loading,
    error,
    reload,
  };
};

export default usePatientFetch;
