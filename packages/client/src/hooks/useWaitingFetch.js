// src/hooks/useWaitingFetch.js
import { useEffect, useState } from 'react';
import axios from '@/libs/axiosInstance';

const useWaitingFetch = () => {
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWaiting = async () => {
    try {
      const { data } = await axios.get('/waiting/status');
      setWaitingList(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaiting();
  }, []);

  return { waitingList, loading, error, refetch: fetchWaiting };
};

export default useWaitingFetch;
