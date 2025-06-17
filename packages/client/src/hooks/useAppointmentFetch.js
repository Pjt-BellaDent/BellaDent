// src/hooks/useAppointmentFetch.js
import { useState, useEffect } from 'react';
import { fetchAppointments } from '@/api/appointments';

const useAppointmentFetch = (month) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAppointments(month);
      setAppointments(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (month) load();
  }, [month]);

  return { appointments, loading, error, reload: load };
};

export default useAppointmentFetch;
