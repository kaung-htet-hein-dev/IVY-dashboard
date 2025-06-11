import { Branch } from "@/types/branch";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React, { useMemo, useState } from "react";
import { BranchActions } from "../components/BranchActions";
import { format } from "date-fns";
import { ApiErrorResponse } from "@/types/api";
import { showErrorToastWithMessage } from "@/utils/error";
import { BranchFormData } from "../types";
import useBranchService from "./useBranchService";

type FormMode = "create" | "edit" | null;

interface FormState {
  mode: FormMode;
  branch?: Branch;
}

interface DeleteState {
  isOpen: boolean;
  branch?: Branch;
}

export const useBranches = () => {
  const branchService = useBranchService();

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState<FormState>({
    mode: null
  });
  const [deleteState, setDeleteState] = useState<DeleteState>({
    isOpen: false
  });

  const { data: branches = [], isLoading: isTableLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: branchService.getBranches
  });

  const { mutate: createBranch, isPending: isCreating } = useMutation<
    Branch,
    ApiErrorResponse,
    Omit<Branch, "id">
  >({
    mutationFn: branchService.createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      enqueueSnackbar("Branch created successfully", { variant: "success" });
      handleCloseForm();
    },
    onError: (error) => {
      showErrorToastWithMessage(error);
    }
  });

  const { mutate: updateBranch, isPending: isUpdating } = useMutation<
    Branch,
    ApiErrorResponse,
    { id: string; data: BranchFormData }
  >({
    mutationFn: ({ id, data }) => branchService.updateBranch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      enqueueSnackbar("Branch updated successfully", { variant: "success" });
      handleCloseForm();
    },
    onError: (error) => {
      showErrorToastWithMessage(error);
    }
  });

  const { mutate: deleteBranch, isPending: isDeleting } = useMutation<
    void,
    ApiErrorResponse,
    string
  >({
    mutationFn: branchService.deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      enqueueSnackbar("Branch deleted successfully", { variant: "success" });
      handleCancelDelete();
    },
    onError: (error) => {
      showErrorToastWithMessage(error);
    }
  });

  const handleView = (branch: Branch) => {
    // TODO: Implement view functionality
    console.log("View branch:", branch);
  };

  const handleEdit = (branch: Branch) => {
    setFormState({ mode: "edit", branch });
  };

  const handleCreate = () => {
    setFormState({ mode: "create" });
  };

  const handleCloseForm = () => {
    setFormState({ mode: null });
  };

  const handleDeleteClick = (branch: Branch) => {
    setDeleteState({ isOpen: true, branch });
  };

  const handleCancelDelete = () => {
    setDeleteState({ isOpen: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteState.branch) return;
    await deleteBranch(deleteState.branch.id);
  };

  const handleSubmit = async (data: BranchFormData | Omit<Branch, "id">) => {
    if (formState.mode === "create") {
      await createBranch(data as Omit<Branch, "id">);
    } else if (formState.mode === "edit" && formState.branch) {
      await updateBranch({
        id: formState.branch.id,
        data
      });
    }
  };

  const columnHelper = createColumnHelper<Branch>();

  const columns = useMemo<ColumnDef<Branch, any>[]>(
    () => [
      columnHelper.accessor("name", {
        header: "Name"
      }),
      columnHelper.accessor("location", {
        header: "Location"
      }),
      columnHelper.accessor("longitude", {
        header: "Longitude"
      }),
      columnHelper.accessor("latitude", {
        header: "Latitude"
      }),
      columnHelper.accessor("phone_number", {
        header: "Phone Number"
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
          <BranchActions
            branch={row.original}
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
    branches,
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
