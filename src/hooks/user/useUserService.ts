import { endpoints } from "@/apiClient/endpoints";
import { User, UsersResponse } from "@/types/user";
import useAxios from "../utility/useAxios";

export const useUserService = () => {
  const { axiosInstance } = useAxios();

  return {
    getUsers: async (
      options: {
        pageIndex: number;
        pageSize: number;
      } = { pageIndex: 0, pageSize: 10 }
    ): Promise<UsersResponse> => {
      const response = await axiosInstance.get<UsersResponse>(endpoints.users, {
        params: {
          offset: options.pageIndex * options.pageSize,
          limit: options.pageSize
        }
      });
      return response.data;
    },

    updateUser: async (
      userData: Partial<User> & { id: string }
    ): Promise<void> => {
      await axiosInstance.put<null>(
        `${endpoints.users}/${userData.id}`,
        userData
      );
    },

    deleteUser: async (id: string): Promise<void> => {
      await axiosInstance.delete(`${endpoints.users}/${id}`);
    }
  };
};

export default useUserService;
