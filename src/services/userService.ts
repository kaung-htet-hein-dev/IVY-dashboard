import { User, UsersResponse } from "@/types/user";
import { endpoints } from "@/api/endpoints";
import { axiosInstance } from "@/api/axios";

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get<UsersResponse>(endpoints.users);
    return response.data.data;
  }
};
