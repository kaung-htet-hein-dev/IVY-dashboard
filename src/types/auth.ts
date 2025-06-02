import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export type LoginRequest = z.infer<typeof loginSchema>;

export interface LoginResponse {
  code: number;
  data: {
    token: string;
  };
  message: string;
}

export interface User {
  id: string;
  email: string;
}
