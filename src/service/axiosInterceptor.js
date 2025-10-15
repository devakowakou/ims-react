import axios from 'axios';
import { BASE_URL, getToken } from './apiConfig';
import AuthService from './AuthService';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error cases
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.error('Unauthorized access - logging out');
          AuthService.logout();
          window.location.href = '/login';
          break;

        case 403:
          // Forbidden - insufficient permissions
          console.error('Access forbidden');
          break;

        case 404:
          // Not found
          console.error('Resource not found');
          break;

        case 429:
          // Too many requests - rate limiting
          console.error('Too many requests - please slow down');
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          console.error('Server error - please try again later');
          break;

        default:
          console.error('An error occurred:', error.response.data?.message || error.message);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error - please check your connection');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
