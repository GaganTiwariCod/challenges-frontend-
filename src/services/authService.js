import { authApi } from '../api/auth.api';

export const authService = {
  createGuest: () => authApi.createGuest(),
  login: (creds) => authApi.login(creds),
  register: (data) => authApi.register(data),
  convertGuest: (data) => authApi.convertGuest(data),
  requestOtp: (email, purpose) => authApi.requestOtp(email, purpose),
  verifyOtp: (payload) => authApi.verifyOtp(payload),
  logout: () => authApi.logout(),
  me: () => authApi.getMe()
};
