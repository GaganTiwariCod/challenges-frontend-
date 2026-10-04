import { api, tokenStorage } from './client';

export const authApi = {
  createGuest: async () => {
    const res = await api.post('/auth/guest');
    if (res.data?.accessToken) {
      tokenStorage.setAccessToken(res.data.accessToken);
      if (res.data.refreshToken) tokenStorage.setRefreshToken(res.data.refreshToken);
      if (res.data.guestId) tokenStorage.setGuestId(res.data.guestId);
    }
    return res.data;
  },

  register: async ({ email, password, name }) => {
    const guestId = tokenStorage.getGuestId();
    const res = await api.post('/auth/register', { email, password, name, guestId });
    if (res.data?.accessToken) {
      tokenStorage.setAccessToken(res.data.accessToken);
      if (res.data.refreshToken) tokenStorage.setRefreshToken(res.data.refreshToken);
    }
    return res.data;
  },

  login: async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.accessToken) {
      tokenStorage.setAccessToken(res.data.accessToken);
      if (res.data.refreshToken) tokenStorage.setRefreshToken(res.data.refreshToken);
    }
    return res.data;
  },

  convertGuest: async ({ email, password, name }) => {
    const res = await api.post('/auth/guest/convert', { email, password, name });
    if (res.data?.accessToken) {
      tokenStorage.setAccessToken(res.data.accessToken);
      if (res.data.refreshToken) tokenStorage.setRefreshToken(res.data.refreshToken);
    }
    return res.data;
  },

  requestOtp: async (email, purpose = 'login') => {
    const res = await api.post('/auth/otp/request', { email, purpose });
    return res.data;
  },

  verifyOtp: async ({ email, otp, purpose = 'login', name }) => {
    const guestId = tokenStorage.getGuestId();
    const res = await api.post('/auth/otp/verify', { email, otp, purpose, name, guestId });
    if (res.data?.accessToken) {
      tokenStorage.setAccessToken(res.data.accessToken);
      if (res.data.refreshToken) tokenStorage.setRefreshToken(res.data.refreshToken);
    }
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res;
  },

  logout: async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch {
      // Ignore network errors during logout
    } finally {
      tokenStorage.clear();
    }
  }
};
