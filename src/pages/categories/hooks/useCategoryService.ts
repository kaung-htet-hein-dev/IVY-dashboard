import { endpoints } from "@/apiClient/endpoints";
import useAxios from "@/hooks/useAxios";
import {
  Category,
  CategoryResponse,
  SingleCategoryResponse
} from "@/types/category";

export const useCategoryService = () => {
  const { axiosInstance } = useAxios();

  return {
    getCategories: async (): Promise<Category[]> => {
      const response = await axiosInstance.get<CategoryResponse>(
        endpoints.categories
      );
      return response.data.data;
    },

    getCategory: async (id: string): Promise<Category> => {
      const response = await axiosInstance.get<SingleCategoryResponse>(
        endpoints.category(id)
      );
      return response.data.data;
    },

    createCategory: async (
      category: Omit<Category, "id" | "created_at" | "updated_at">
    ): Promise<Category> => {
      const response = await axiosInstance.post<SingleCategoryResponse>(
        endpoints.categories,
        category
      );
      return response.data.data;
    },

    updateCategory: async (
      id: string,
      category: Partial<Omit<Category, "id" | "created_at" | "updated_at">>
    ): Promise<Category> => {
      const response = await axiosInstance.put<SingleCategoryResponse>(
        endpoints.category(id),
        category
      );
      return response.data.data;
    },

    deleteCategory: async (id: string): Promise<void> => {
      await axiosInstance.delete(endpoints.category(id));
    }
  };
};

export default useCategoryService;
