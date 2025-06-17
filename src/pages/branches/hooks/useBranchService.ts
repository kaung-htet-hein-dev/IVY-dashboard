import { endpoints } from "@/apiClient/endpoints";
import useAxios from "@/hooks/useAxios";
import { Branch, BranchResponse } from "@/types/branch";

export const useBranchService = () => {
  const { axiosInstance } = useAxios();

  return {
    getBranches: async ({
      pageIndex = 0,
      pageSize = 10,
      is_active
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
            limit: pageSize,
            is_active: !!is_active
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
