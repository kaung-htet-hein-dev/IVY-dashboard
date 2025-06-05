import { axiosInstance } from "@/api/axios";
import { endpoints } from "@/api/endpoints";
import { useAuthStore } from "@/store/useAuthStore";
import {
  loginSchema,
  type LoginRequest,
  type LoginResponse
} from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();
  const { setToken } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema)
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await axiosInstance.post<LoginResponse>(
        endpoints.login,
        data
      );
      return response.data;
    },
    onSuccess: async () => {
      // Small delay to ensure cookie is set
      await new Promise((resolve) => setTimeout(resolve, 100));
      router.replace("/bookings");
    }
  });

  const onSubmit = (data: LoginRequest) => {
    loginMutation.mutate(data);
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isPending: loginMutation.isPending
  };
};
