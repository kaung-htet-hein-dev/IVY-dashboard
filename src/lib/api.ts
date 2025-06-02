import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import Router from "next/router";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth state
      useAuthStore.getState().logout();

      // Redirect to login page using Next.js Router
      // Don't redirect if we're already on the login page
      if (!window.location.pathname.includes("/login")) {
        await Router.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
