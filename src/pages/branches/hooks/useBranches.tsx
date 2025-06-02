import { branchService } from "@/services/branchService";
import { Branch } from "@/types/branch";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React, { useMemo, useState } from "react";
import { BranchActions } from "../components/BranchActions";

type FormMode = "create" | "edit" | null;

interface FormState {
  mode: FormMode;
  branch?: Branch;
  isLoading: boolean;
}

interface DeleteState {
  isOpen: boolean;
  branch?: Branch;
  isLoading: boolean;
}

export const useBranches = () => {
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

  const { data: branches = [], isLoading: isTableLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: branchService.getBranches
  });

  const handleView = (branch: Branch) => {
    // TODO: Implement view functionality
    console.log("View branch:", branch);
  };

  const handleEdit = (branch: Branch) => {
    setFormState({ mode: "edit", branch, isLoading: false });
  };

  const handleCreate = () => {
    setFormState({ mode: "create", isLoading: false });
  };

  const handleCloseForm = () => {
    setFormState({ mode: null, isLoading: false });
  };

  const handleDeleteClick = (branch: Branch) => {
    setDeleteState({ isOpen: true, branch, isLoading: false });
  };

  const handleCancelDelete = () => {
    setDeleteState({ isOpen: false, isLoading: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteState.branch) return;

    setDeleteState((prev) => ({ ...prev, isLoading: true }));
    try {
      await branchService.deleteBranch(deleteState.branch.id);
      await queryClient.invalidateQueries({ queryKey: ["branches"] });
      enqueueSnackbar("Branch deleted successfully", { variant: "success" });
      setDeleteState({ isOpen: false, isLoading: false });
    } catch (error) {
      enqueueSnackbar("Failed to delete branch", { variant: "error" });
      setDeleteState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSubmit = async (data: Omit<Branch, "id">) => {
    setFormState((prev) => ({ ...prev, isLoading: true }));
    try {
      if (formState.mode === "create") {
        await branchService.createBranch(data);
        enqueueSnackbar("Branch created successfully", { variant: "success" });
      } else if (formState.mode === "edit" && formState.branch) {
        await branchService.updateBranch(formState.branch.id, {
          name: data.name,
          location: data.location,
          longitude: data.longitude,
          latitude: data.latitude,
          phone_number: data.phone_number
        });
        enqueueSnackbar("Branch updated successfully", { variant: "success" });
      }
      await queryClient.invalidateQueries({ queryKey: ["branches"] });
      setFormState({ mode: null, isLoading: false });
    } catch (error) {
      enqueueSnackbar(
        `Failed to ${formState.mode === "create" ? "create" : "update"} branch`,
        { variant: "error" }
      );
      setFormState((prev) => ({ ...prev, isLoading: false }));
      throw error;
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
    formState,
    handleCloseForm,
    handleSubmit,
    deleteState,
    handleCancelDelete,
    handleConfirmDelete
  };
};
