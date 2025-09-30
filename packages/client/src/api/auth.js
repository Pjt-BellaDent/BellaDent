// src/api/auth.js
import axios from '../libs/axiosInstance.js';

export const fetchDetailedUserInfoById = async (userId) => {
  try {
    const response = await axios.get(`/users/${userId}`);
    return response.data.userInfo;
  } catch (error) {
    console.error(`Error fetching detailed user info by ID ${userId}:`, error);
    throw error;
  }
};
