import { categoryService } from "@/services/categoryService";
import { Category } from "@/types/category";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React, { useMemo, useState } from "react";
import { CategoryActions } from "../components/CategoryActions";
import { CategoryFormData, DeleteState, FormState } from "../types";

export const useCategories = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState<FormState>({
    mode: null,
    isLoading: false
  });
  const [deleteState, setDeleteState] = useState<DeleteState>({
    isOpen: false,
    isLoading: false
  });

  const { data: categories = [], isLoading: isTableLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories
  });

  const handleView = (category: Category) => {
    // TODO: Implement view functionality
    console.log("View category:", category);
  };

  const handleEdit = (category: Category) => {
    setFormState({ mode: "edit", category, isLoading: false });
  };

  const handleCreate = () => {
    setFormState({ mode: "create", isLoading: false });
  };

  const handleCloseForm = () => {
    setFormState({ mode: null, isLoading: false });
  };

  const handleDeleteClick = (category: Category) => {
    setDeleteState({ isOpen: true, category, isLoading: false });
  };

  const handleCancelDelete = () => {
    setDeleteState({ isOpen: false, isLoading: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteState.category) return;

    setDeleteState((prev) => ({ ...prev, isLoading: true }));
    try {
      await categoryService.deleteCategory(deleteState.category.id);
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      enqueueSnackbar("Category deleted successfully", { variant: "success" });
      setDeleteState({ isOpen: false, isLoading: false });
    } catch (error) {
      enqueueSnackbar("Failed to delete category", { variant: "error" });
      setDeleteState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSubmit = async (data: CategoryFormData) => {
    setFormState((prev) => ({ ...prev, isLoading: true }));
    try {
      if (formState.mode === "create") {
        await categoryService.createCategory(data);
        enqueueSnackbar("Category created successfully", {
          variant: "success"
        });
      } else if (formState.mode === "edit" && formState.category) {
        await categoryService.updateCategory(formState.category.id, {
          name: data.name
        });
        enqueueSnackbar("Category updated successfully", {
          variant: "success"
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      setFormState({ mode: null, isLoading: false });
    } catch (error) {
      enqueueSnackbar(
        `Failed to ${
          formState.mode === "create" ? "create" : "update"
        } category`,
        { variant: "error" }
      );
      setFormState((prev) => ({ ...prev, isLoading: false }));
      throw error;
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
        cell: (info) => new Date(info.getValue()).toLocaleDateString()
      }),
      columnHelper.accessor("updated_at", {
        header: "Updated At",
        cell: (info) => new Date(info.getValue()).toLocaleDateString()
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
    formState,
    handleCloseForm,
    handleSubmit,
    deleteState,
    handleCancelDelete,
    handleConfirmDelete
  };
};
