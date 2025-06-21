import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";
import { User } from "@/types/user";
import { endpoints } from "@/apiClient/endpoints";

interface CurrentUserResponse {
  code: number;
  data: User;
  message: string;
}

export const useCurrentUser = () => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async (): Promise<User> => {
      const response = await axiosInstance.get(endpoints.userProfile);
      return response.data.data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};
