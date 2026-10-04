import { api } from './client';

export const challengeApi = {
  getCategories: async () => {
    const res = await api.get('/categories');
    return res.data?.categories || [];
  },

  getChallenges: async (params = {}) => {
    const res = await api.get('/challenges', params);
    return res.data || { items: [], pagination: {} };
  },

  getChallenge: async (id) => {
    const res = await api.get(`/challenges/${id}`);
    return res.data?.challenge;
  },

  createChallenge: async (data) => {
    const res = await api.post('/challenges', data);
    return res.data?.challenge;
  },

  updateChallenge: async (id, data) => {
    const res = await api.patch(`/challenges/${id}`, data);
    return res.data?.challenge;
  },

  takeOath: async (id, oathText) => {
    const res = await api.post(`/challenges/${id}/oath`, { oathText });
    return res.data?.challenge;
  },

  publishChallenge: async (id) => {
    const res = await api.post(`/challenges/${id}/publish`);
    return res.data?.challenge;
  },

  cancelChallenge: async (id) => {
    const res = await api.delete(`/challenges/${id}`);
    return res.data;
  },

  likeChallenge: async (id) => {
    const res = await api.post(`/challenges/${id}/like`);
    return res.data;
  },

  unlikeChallenge: async (id) => {
    const res = await api.delete(`/challenges/${id}/like`);
    return res.data;
  }
};
