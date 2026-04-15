import axiosInstance from './axiosInstance.js';

export const getConversations = () => axiosInstance.get('/chat/conversations');
export const createOrGetConversation = (recipientId) =>
  axiosInstance.post('/chat/conversations', { recipientId });
export const getMessages = (convId, params) =>
  axiosInstance.get(`/chat/conversations/${convId}/messages`, { params });
