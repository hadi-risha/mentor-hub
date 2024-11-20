// src/utils/axiosInstance.ts
import axios from 'axios';
import config from '../../config';

const axiosInstance = axios.create({
  baseURL: config.backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request Interceptor to include token
axiosInstance.interceptors.request.use(
    (request) => {
      const token = localStorage.getItem('token'); // Get token from local storage
      if (token) {
        request.headers['Authorization'] = `Bearer ${token}`; // Attach token to headers
      }
      return request;
    },
    (error) => {
      return Promise.reject(error);
    }
  );




// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here
    // return Promise.reject(error.response || error);
    return Promise.reject(
      error.response ? error.response : { data: { message: "An unknown error occurred. from axios instance" } }
    );
  }
);

export default axiosInstance;
