import { endpoints } from "@/apiClient/endpoints";
import useAxios from "@/hooks/useAxios";
import { User } from "@/types/user";

export const useUserService = () => {
  const { axiosInstance } = useAxios();

  return {
    getUser: async (id: string): Promise<User> => {
      const response = await axiosInstance.get<{
        code: number;
        data: User;
        message: string;
      }>(endpoints.user(id));
      return response.data.data;
    }
  };
};

export default useUserService;
