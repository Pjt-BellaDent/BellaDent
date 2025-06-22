import axios from '../libs/axiosIntance';

/**
 * AI 챗봇 설정 정보를 서버에서 가져옵니다.
 * @returns {Promise<object>} 챗봇 설정 데이터
 */
export const getChatbotSettings = async () => {
  const { data } = await axios.get('/ai-chat/settings');
  return data;
};

/**
 * 새로운 챗봇 설정 정보를 서버에 업데이트합니다.
 * @param {object} settings - 업데이트할 설정 데이터
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const updateChatbotSettings = async (settings) => {
  const { data } = await axios.put('/ai-chat/settings', settings);
  return data;
}; 