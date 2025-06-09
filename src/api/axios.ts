import { auth } from "@clerk/nextjs/server";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add request interceptor for authentication
axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") {
      // Server-side
      const session = await auth();
      const token = await session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // Client-side
      try {
        // We need to dynamically import the useClerk hook because it's only available client-side
        if ((window as any).__clerk_client) {
          const token = await (
            window as any
          ).__clerk_client?.session?.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (error) {
        console.error("Failed to get auth token:", error);
      }
    }
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
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);
