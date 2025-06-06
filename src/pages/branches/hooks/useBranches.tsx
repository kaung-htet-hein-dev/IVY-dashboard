import { branchService } from "@/services/branchService";
import { Branch } from "@/types/branch";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React, { useMemo, useState } from "react";
import { BranchActions } from "../components/BranchActions";
import { format } from "date-fns";
import { ErrorResponse } from "@/types/api";

type FormMode = "create" | "edit" | null;

interface FormState {
  mode: FormMode;
  branch?: Branch;
}

interface DeleteState {
  isOpen: boolean;
  branch?: Branch;
}

type BranchFormData = Omit<Branch, "id">;

export const useBranches = () => {
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
    ErrorResponse,
    BranchFormData
  >({
    mutationFn: branchService.createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      enqueueSnackbar("Branch created successfully", { variant: "success" });
      handleCloseForm();
    },
    onError: (error) => {
      enqueueSnackbar(error.data?.data?.message ?? "Failed to create branch", {
        variant: "error"
      });
    }
  });

  const { mutate: updateBranch, isPending: isUpdating } = useMutation<
    Branch,
    ErrorResponse,
    { id: string; data: BranchFormData }
  >({
    mutationFn: ({ id, data }) => branchService.updateBranch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      enqueueSnackbar("Branch updated successfully", { variant: "success" });
      handleCloseForm();
    },
    onError: (error) => {
      enqueueSnackbar(error.data?.data?.message ?? "Failed to update branch", {
        variant: "error"
      });
    }
  });

  const { mutate: deleteBranch, isPending: isDeleting } = useMutation<
    void,
    ErrorResponse,
    string
  >({
    mutationFn: branchService.deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      enqueueSnackbar("Branch deleted successfully", { variant: "success" });
      handleCancelDelete();
    },
    onError: (error) => {
      enqueueSnackbar(error.data?.data?.message ?? "Failed to delete branch", {
        variant: "error"
      });
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

  const handleSubmit = async (data: BranchFormData) => {
    if (formState.mode === "create") {
      await createBranch(data);
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
