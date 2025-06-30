import axiosInstance from '../libs/axiosInstance.js';

/**
 * AI 챗봇 설정 정보를 서버에서 가져옵니다.
 * @returns {Promise<object>} 챗봇 설정 데이터
 */
export const getChatbotSettings = async () => {
  const { data } = await axiosInstance.get('/ai/settings');
  return data;
};

/**
 * 새로운 챗봇 설정 정보를 서버에 업데이트합니다.
 * @param {object} settings - 업데이트할 설정 데이터
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const updateChatbotSettings = async (settings) => {
  const { data } = await axiosInstance.put('/ai/settings', settings);
  return data;
};

/**
 * AI 챗봇과 대화를 시작합니다.
 * @param {string} message - 사용자 메시지
 * @param {string} consultationId - 상담 ID
 * @returns {Promise<object>} AI 응답 데이터
 */
export const sendMessageToAI = async (message, consultationId) => {
  const { data } = await axiosInstance.post('/ai/ai', {
    message,
    consultationId
  });
  return data;
};

/**
 * FAQ 목록 가져오기
 * @returns {Promise<object>} FAQ 목록 데이터
 */
export const getFaqs = async () => {
  const { data } = await axiosInstance.get('/ai/faqs');
  return data;
};

/**
 * FAQ 목록 저장하기
 * @param {object} faqs - FAQ 목록 데이터
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const saveFaqs = async (faqs) => {
  const { data } = await axiosInstance.post('/ai/faqs', { faqs });
  return data;
}; 