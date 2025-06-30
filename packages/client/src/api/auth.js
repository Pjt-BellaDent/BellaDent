// client/src/api/auth.js (수정)

import axios from '../libs/axiosInstance.js';

// 특정 사용자 ID로 상세 사용자 정보를 가져옵니다.
export const fetchDetailedUserInfoById = async (userId) => {
  try {
    const response = await axios.get(`/users/${userId}`);
    return response.data.userInfo; 
  } catch (error) {
    console.error(`Error fetching detailed user info by ID ${userId}:`, error);
    throw error;
  }
};
