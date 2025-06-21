import { endpoints } from "@/apiClient/endpoints";
import { User } from "@/types/user";
import useAxios from "../utility/useAxios";

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
