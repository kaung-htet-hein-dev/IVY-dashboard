import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig
} from "axios";
import { ApiErrorResponse } from "@/types/api";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const createAxiosInstance = (
  getToken: () => Promise<string | null>,
  onAuthError: () => void
): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json"
    },
    withCredentials: true
  });

  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: ApiErrorResponse) => {
      if (error.response?.status === 401) {
        onAuthError();
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
