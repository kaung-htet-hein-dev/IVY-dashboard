import axios from "axios";
import { Branch, BranchResponse } from "@/types/branch";
import { endpoints } from "@/apiClient/endpoints";
import { axiosInstance } from "@/apiClient/axios";

export const branchService = {
  getBranches: async (): Promise<Branch[]> => {
    const response = await axiosInstance.get<BranchResponse>(
      endpoints.branches
    );
    return response.data.data;
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
