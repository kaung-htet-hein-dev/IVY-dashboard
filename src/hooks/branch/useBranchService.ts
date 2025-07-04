import { endpoints } from "@/apiClient/endpoints";
import { Branch, BranchResponse } from "@/types/branch";
import useAxios from "../utility/useAxios";

export const useBranchService = () => {
  const { axiosInstance } = useAxios();

  return {
    getBranches: async ({
      pageIndex = 0,
      pageSize = 10
    }: {
      pageIndex?: number;
      pageSize?: number;
      is_active?: boolean;
    }): Promise<BranchResponse> => {
      const response = await axiosInstance.get<BranchResponse>(
        endpoints.branches,
        {
          params: {
            offset: pageIndex * pageSize,
            limit: pageSize
          }
        }
      );
      return response.data;
    },

    getBranch: async (id: string): Promise<Branch> => {
      const response = await axiosInstance.get<{ data: Branch }>(
        endpoints.branch(id)
      );
      return response.data.data;
    },

    createBranch: async (branch: Omit<Branch, "id">): Promise<Branch> => {
      const response = await axiosInstance.post<{ data: Branch }>(
        endpoints.branches,
        branch
      );
      return response.data.data;
    },

    updateBranch: async (
      id: string,
      branch: Partial<Branch>
    ): Promise<Branch> => {
      const response = await axiosInstance.put<{ data: Branch }>(
        endpoints.branch(id),
        branch
      );
      return response.data.data;
    },

    deleteBranch: async (id: string): Promise<void> => {
      await axiosInstance.delete(endpoints.branch(id));
    }
  };
};

export default useBranchService;
