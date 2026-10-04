import { api } from './client';

export const commentApi = {
  getComments: async (challengeId, params = {}) => {
    const res = await api.get(`/challenges/${challengeId}/comments`, params);
    return res.data?.items || [];
  },

  addComment: async (challengeId, content) => {
    const res = await api.post(`/challenges/${challengeId}/comments`, { content });
    return res.data?.comment;
  },

  deleteComment: async (challengeId, commentId) => {
    const res = await api.delete(`/challenges/${challengeId}/comments/${commentId}`);
    return res.data;
  }
};
