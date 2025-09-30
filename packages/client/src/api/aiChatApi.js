// src/api/aiChatApi.js
import axiosInstance from '../libs/axiosInstance.js';

export const getChatbotSettings = async () => {
  const { data } = await axiosInstance.get('/ai/settings');
  return data;
};

export const updateChatbotSettings = async (settings) => {
  const { data } = await axiosInstance.put('/ai/settings', settings);
  return data;
};

export const sendMessageToAI = async (message, consultationId) => {
  const { data } = await axiosInstance.post('/ai/ai', {
    message,
    consultationId
  });
  return data;
};

export const getFaqs = async () => {
  const { data } = await axiosInstance.get('/ai/faqs');
  return data;
};

export const saveFaqs = async (faqs) => {
  const { data } = await axiosInstance.post('/ai/faqs', { faqs });
  return data;
}; 