import { endpoints } from "@/apiClient/endpoints";
import useAxios from "@/hooks/useAxios";
import { User, UsersResponse } from "@/types/user";

export const useUserService = () => {
  const { axiosInstance } = useAxios();

  return {
    getUsers: async (): Promise<User[]> => {
      const response = await axiosInstance.get<UsersResponse>(endpoints.users);
      return response.data.data;
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
