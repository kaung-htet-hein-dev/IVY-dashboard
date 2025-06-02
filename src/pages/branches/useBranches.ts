import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { AxiosResponse } from "axios";

export interface Branch {
  id: string;
  name: string;
  location: string;
  longitude: string;
  latitude: string;
  phoneNumber: string;
}

const branchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  longitude: z.string().min(1, "Longitude is required"),
  latitude: z.string().min(1, "Latitude is required"),
  phoneNumber: z.string().min(1, "Phone number is required")
});

export type BranchFormData = z.infer<typeof branchSchema>;

export function useBranches() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema)
  });

  const { data: branches, isLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const response = await api.get<AxiosResponse<Branch[]>>("/api/v1/branch");
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: BranchFormData) => {
      const response = await api.post("/api/v1/branch", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      enqueueSnackbar("Branch created successfully", { variant: "success" });
      handleCreateModalClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to create branch",
        { variant: "error" }
      );
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BranchFormData }) => {
      const response = await api.put(`/api/v1/branch/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      enqueueSnackbar("Branch updated successfully", { variant: "success" });
      handleEditModalClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to update branch",
        { variant: "error" }
      );
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/branch/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      enqueueSnackbar("Branch deleted successfully", { variant: "success" });
      handleDeleteDialogClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to delete branch",
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

  const handleEditModalOpen = (branch: Branch) => {
    setSelectedBranch(branch);
    form.reset(branch);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setSelectedBranch(null);
    form.reset();
    setIsEditModalOpen(false);
  };

  const handleDeleteDialogOpen = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setSelectedBranch(null);
    setIsDeleteDialogOpen(false);
  };

  const onCreateSubmit = (data: BranchFormData) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: BranchFormData) => {
    if (selectedBranch) {
      updateMutation.mutate({ id: selectedBranch.id, data });
    }
  };

  const onDeleteConfirm = () => {
    if (selectedBranch) {
      deleteMutation.mutate(selectedBranch.id);
    }
  };

  return {
    form,
    branches: branches?.data || [],
    selectedBranch,
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
