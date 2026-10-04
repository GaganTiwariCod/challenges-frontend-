const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'challenge_access_token';
const REFRESH_TOKEN_KEY = 'challenge_refresh_token';
const GUEST_ID_KEY = 'challenge_guest_id';

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(TOKEN_KEY),
  setAccessToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  getGuestId: () => localStorage.getItem(GUEST_ID_KEY),
  setGuestId: (id) => localStorage.setItem(GUEST_ID_KEY, id),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(GUEST_ID_KEY);
  }
};

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = tokenStorage.getAccessToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    let response = await fetch(url, config);

    // Handle 401 Unauthorized by attempting token refresh
    if (response.status === 401 && tokenStorage.getRefreshToken() && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/guest')) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: tokenStorage.getRefreshToken() })
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newAccessToken = refreshData.data?.accessToken;
            const newRefreshToken = refreshData.data?.refreshToken;
            if (newAccessToken) {
              tokenStorage.setAccessToken(newAccessToken);
              if (newRefreshToken) tokenStorage.setRefreshToken(newRefreshToken);
              onRefreshed(newAccessToken);
              headers['Authorization'] = `Bearer ${newAccessToken}`;
              response = await fetch(url, { ...config, headers });
            }
          } else {
            tokenStorage.clear();
          }
        } catch (refreshErr) {
          tokenStorage.clear();
        } finally {
          isRefreshing = false;
        }
      } else {
        // Wait for active refresh to finish
        const retryToken = await new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => resolve(newToken));
        });
        if (retryToken) {
          headers['Authorization'] = `Bearer ${retryToken}`;
          response = await fetch(url, { ...config, headers });
        }
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.error?.message || data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.code = data.error?.code || 'API_ERROR';
      error.details = data.error?.details || null;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const networkErr = new Error('Unable to connect to backend server. Please check your connection.');
      networkErr.code = 'NETWORK_ERROR';
      throw networkErr;
    }
    throw err;
  }
}

export const api = {
  get: (endpoint, params = null) => {
    let url = endpoint;
    if (params) {
      const filtered = Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '');
      if (filtered.length > 0) {
        const qs = new URLSearchParams(filtered).toString();
        url += `${url.includes('?') ? '&' : '?'}${qs}`;
      }
    }
    return request(url, { method: 'GET' });
  },
  post: (endpoint, body = {}) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    }),
  patch: (endpoint, body = {}) =>
    request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body)
    }),
  delete: (endpoint) =>
    request(endpoint, {
      method: 'DELETE'
    })
};
