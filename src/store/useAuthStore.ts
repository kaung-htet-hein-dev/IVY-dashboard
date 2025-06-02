import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/auth";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  logout: () => void;
}

interface JwtPayload {
  exp: number;
  iat: number;
  user_id: string;
}

const axiosInstance = axios.create();

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token: string) => {
        const decoded = jwtDecode<JwtPayload>(token);
        set({
          token,
          user: {
            id: decoded.user_id,
            email: "" // We'll need to get this from the API or login response
          }
        });
        localStorage.setItem("token", token);
      },
      logout: () => {
        set({ token: null, user: null });
        localStorage.removeItem("token");
      }
    }),
    {
      name: "auth-storage"
    }
  )
);
