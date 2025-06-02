import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { AxiosResponse } from "axios";

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const categorySchema = z.object({
  name: z.string().min(1, "Name is required")
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export function useCategories() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema)
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<AxiosResponse<Category[]>>(
        "/api/v1/category"
      );
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const response = await api.post("/api/v1/category", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      enqueueSnackbar("Category created successfully", { variant: "success" });
      handleCreateModalClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to create category",
        { variant: "error" }
      );
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data
    }: {
      id: string;
      data: CategoryFormData;
    }) => {
      const response = await api.put(`/api/v1/category/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      enqueueSnackbar("Category updated successfully", { variant: "success" });
      handleEditModalClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to update category",
        { variant: "error" }
      );
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/category/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      enqueueSnackbar("Category deleted successfully", { variant: "success" });
      handleDeleteDialogClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to delete category",
        { variant: "error" }
      );
    }
  });

  const handleCreateModalOpen = () => {
    form.reset();
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    form.reset();
    setIsCreateModalOpen(false);
  };

  const handleEditModalOpen = (category: Category) => {
    setSelectedCategory(category);
    form.reset({ name: category.name });
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setSelectedCategory(null);
    form.reset();
    setIsEditModalOpen(false);
  };

  const handleDeleteDialogOpen = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setSelectedCategory(null);
    setIsDeleteDialogOpen(false);
  };

  const onCreateSubmit = (data: CategoryFormData) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: CategoryFormData) => {
    if (selectedCategory) {
      updateMutation.mutate({ id: selectedCategory.id, data });
    }
  };

  const onDeleteConfirm = () => {
    if (selectedCategory) {
      deleteMutation.mutate(selectedCategory.id);
    }
  };

  return {
    form,
    categories: categories?.data || [],
    selectedCategory,
    isLoading,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    createMutation,
    updateMutation,
    deleteMutation,
    handleCreateModalOpen,
    handleCreateModalClose,
    handleEditModalOpen,
    handleEditModalClose,
    handleDeleteDialogOpen,
    handleDeleteDialogClose,
    onCreateSubmit,
    onEditSubmit,
    onDeleteConfirm
  };
}
