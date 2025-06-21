import { Category } from "@/types/category";
import {
  ColumnDef,
  createColumnHelper,
  PaginationState
} from "@tanstack/react-table";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData
} from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React, { useMemo, useState } from "react";
import { CategoryFormData } from "../../components/category/types";
import { format } from "date-fns";
import { ApiErrorResponse } from "@/types/api";
import { showErrorToastWithMessage } from "@/utils/error";
import { getFormattedShowDateTime } from "@/utils/date";
import { CategoryActions } from "@/components/category/CategoryActions";
import useCategoryService from "./useCategoryService";

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
  const categoryService = useCategoryService();
  const [formState, setFormState] = useState<FormState>({
    mode: null
  });
  const [deleteState, setDeleteState] = useState<DeleteState>({
    isOpen: false
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const { data: categories, isLoading: isTableLoading } = useQuery({
    queryKey: ["categories", pagination],
    queryFn: () => categoryService.getCategories(pagination),
    placeholderData: keepPreviousData
  });

  const { mutate: createCategory, isPending: isCreating } = useMutation<
    Category,
    ApiErrorResponse,
    CategoryFormData
  >({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      enqueueSnackbar("Category created successfully", { variant: "success" });
      handleCloseForm();
    },
    onError: (error) => {
      showErrorToastWithMessage(error);
    }
  });

  const { mutate: updateCategory, isPending: isUpdating } = useMutation<
    Category,
    ApiErrorResponse,
    { id: string; data: CategoryFormData }
  >({
    mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      enqueueSnackbar("Category updated successfully", { variant: "success" });
      handleCloseForm();
    },
    onError: (error) => {
      showErrorToastWithMessage(error);
    }
  });

  const { mutate: deleteCategory, isPending: isDeleting } = useMutation<
    void,
    ApiErrorResponse,
    string
  >({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      enqueueSnackbar("Category deleted successfully", { variant: "success" });
      handleCancelDelete();
    },
    onError: (error) => {
      showErrorToastWithMessage(error);
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
        cell: (props) => getFormattedShowDateTime(props.getValue())
      }),
      columnHelper.accessor("updated_at", {
        header: "Updated At",
        cell: (props) => getFormattedShowDateTime(props.getValue())
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
    handleConfirmDelete,
    pagination,
    setPagination
  };
};
