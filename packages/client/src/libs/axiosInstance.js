// client/src/libs/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem("userToken");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default instance;
