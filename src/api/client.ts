import axios from 'axios';
import { detectTenant } from '../utils/tenant';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add Authorization + X-Tenant-Subdomain headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const subdomain = detectTenant();
  if (subdomain) {
    config.headers['X-Tenant-Subdomain'] = subdomain;
  }

  return config;
});

// Response interceptor: handle 401 → try refresh, else redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL ?? 'http://localhost:5000'}/api/auth/refresh`,
            { refreshToken },
          );
          localStorage.setItem('access_token', data.accessToken);
          localStorage.setItem('refresh_token', data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(originalRequest);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/app/login';
        }
      } else {
        window.location.href = '/app/login';
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
