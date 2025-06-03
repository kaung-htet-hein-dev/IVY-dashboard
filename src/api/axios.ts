import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true // This is required for cookies to be sent with requests
});

// Add request interceptor for authentication
axiosInstance.interceptors.request.use(
  (config) => {
    // We don't need to manually set the Authorization header
    // The cookie will be automatically included in requests
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
