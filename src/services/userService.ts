import { User, UsersResponse } from "@/types/user";
import { endpoints } from "@/apiClient/endpoints";
import { axiosInstance } from "@/apiClient/axios";

export const userService = {
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
