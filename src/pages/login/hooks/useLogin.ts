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
import { ErrorResponse } from "@/types/api";
import { enqueueSnackbar } from "notistack";
import { showErrorToastWithMessage } from "@/utils/error";

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

  const loginMutation = useMutation<LoginResponse, ErrorResponse, LoginRequest>(
    {
      mutationFn: async (data) => {
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
      },
      onError: (error) => {
        showErrorToastWithMessage(error);
      }
    }
  );

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
