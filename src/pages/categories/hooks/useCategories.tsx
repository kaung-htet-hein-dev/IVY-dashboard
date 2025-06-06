import { categoryService } from "@/services/categoryService";
import { Category } from "@/types/category";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React, { useMemo, useState } from "react";
import { CategoryActions } from "../components/CategoryActions";
import { CategoryFormData } from "../types";
import { format } from "date-fns";
import { ErrorResponse } from "@/types/api";

interface FormState {
  mode: "create" | "edit" | null;
  category?: Category;
}

interface DeleteState {
  isOpen: boolean;
  category?: Category;
}

export const useCategories = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState<FormState>({
    mode: null
  });
  const [deleteState, setDeleteState] = useState<DeleteState>({
    isOpen: false
  });

  const { data: categories = [], isLoading: isTableLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories
  });

  const { mutate: createCategory, isPending: isCreating } = useMutation<
    Category,
    ErrorResponse,
    CategoryFormData
  >({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      enqueueSnackbar("Category created successfully", { variant: "success" });
      handleCloseForm();
    },
    onError: (error) => {
      enqueueSnackbar(
        error.data?.data?.message ?? "Failed to create category",
        { variant: "error" }
      );
    }
  });

  const { mutate: updateCategory, isPending: isUpdating } = useMutation<
    Category,
    ErrorResponse,
    { id: string; data: CategoryFormData }
  >({
    mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      enqueueSnackbar("Category updated successfully", { variant: "success" });
      handleCloseForm();
    },
    onError: (error) => {
      enqueueSnackbar(
        error.data?.data?.message ?? "Failed to update category",
        { variant: "error" }
      );
    }
  });

  const { mutate: deleteCategory, isPending: isDeleting } = useMutation<
    void,
    ErrorResponse,
    string
  >({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      enqueueSnackbar("Category deleted successfully", { variant: "success" });
      handleCancelDelete();
    },
    onError: (error) => {
      enqueueSnackbar(
        error.data?.data?.message ?? "Failed to delete category",
        { variant: "error" }
      );
    }
  });

  const handleView = (category: Category) => {
    // TODO: Implement view functionality
    console.log("View category:", category);
  };

  const handleEdit = (category: Category) => {
    setFormState({ mode: "edit", category });
  };

  const handleCreate = () => {
    setFormState({ mode: "create" });
  };

  const handleCloseForm = () => {
    setFormState({ mode: null });
  };

  const handleDeleteClick = (category: Category) => {
    setDeleteState({ isOpen: true, category });
  };

  const handleCancelDelete = () => {
    setDeleteState({ isOpen: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteState.category) return;
    await deleteCategory(deleteState.category.id);
  };

  const handleSubmit = async (data: CategoryFormData) => {
    if (formState.mode === "create") {
      await createCategory(data);
    } else if (formState.mode === "edit" && formState.category) {
      await updateCategory({
        id: formState.category.id,
        data
      });
    }
  };

  const columnHelper = createColumnHelper<Category>();

  const columns = useMemo<ColumnDef<Category, any>[]>(
    () => [
      columnHelper.accessor("name", {
        header: "Name"
      }),
      columnHelper.accessor("created_at", {
        header: "Created At",
        cell: (props) => format(new Date(props.getValue()), "PPpp")
      }),
      columnHelper.accessor("updated_at", {
        header: "Updated At",
        cell: (props) => format(new Date(props.getValue()), "PPpp")
      }),
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <CategoryActions
            category={row.original}
            onView={() => handleView(row.original)}
            onEdit={() => handleEdit(row.original)}
            onDelete={() => handleDeleteClick(row.original)}
          />
        )
      }
    ],
    []
  );

  return {
    categories,
    isLoading: isTableLoading,
    columns,
    handleCreate,
    formState: {
      ...formState,
      isLoading: isCreating || isUpdating
    },
    handleCloseForm,
    handleSubmit,
    deleteState: {
      ...deleteState,
      isLoading: isDeleting
    },
    handleCancelDelete,
    handleConfirmDelete
  };
};
