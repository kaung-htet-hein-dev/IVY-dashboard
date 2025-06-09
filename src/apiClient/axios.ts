import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add request interceptor for authentication
axiosInstance.interceptors.request.use(async (config) => {
  return config;
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);
