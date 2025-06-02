import { useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DataTable from "@/components/common/DataTable";
import FormModal from "@/components/common/FormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import api from "@/lib/api";
import { AxiosResponse } from "axios";

interface Branch {
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

type BranchFormData = z.infer<typeof branchSchema>;

export default function BranchesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<BranchFormData>({
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
    reset();
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    reset();
    setIsCreateModalOpen(false);
  };

  const handleEditModalOpen = (branch: Branch) => {
    setSelectedBranch(branch);
    reset(branch);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setSelectedBranch(null);
    reset();
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

  const columns = [
    {
      header: "Name",
      accessorKey: "name"
    },
    {
      header: "Location",
      accessorKey: "location"
    },
    {
      header: "Phone Number",
      accessorKey: "phoneNumber"
    },
    {
      header: "Coordinates",
      accessorKey: "longitude",
      cell: (info: any) =>
        `${info.row.original.latitude}, ${info.row.original.longitude}`
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (info: any) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleEditModalOpen(info.row.original)}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDeleteDialogOpen(info.row.original)}
          >
            Delete
          </Button>
        </Box>
      )
    }
  ];

  const renderFormFields = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
      <TextField
        label="Name"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
      />
      <TextField
        label="Location"
        {...register("location")}
        error={!!errors.location}
        helperText={errors.location?.message}
        fullWidth
      />
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Latitude"
          {...register("latitude")}
          error={!!errors.latitude}
          helperText={errors.latitude?.message}
          fullWidth
        />
        <TextField
          label="Longitude"
          {...register("longitude")}
          error={!!errors.longitude}
          helperText={errors.longitude?.message}
          fullWidth
        />
      </Box>
      <TextField
        label="Phone Number"
        {...register("phoneNumber")}
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber?.message}
        fullWidth
      />
    </Box>
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3
        }}
      >
        <Typography variant="h4">Branches</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateModalOpen}
        >
          Add Branch
        </Button>
      </Box>

      <DataTable
        data={branches?.data || []}
        columns={columns}
        isLoading={isLoading}
      />

      <FormModal
        open={isCreateModalOpen}
        onClose={handleCreateModalClose}
        title="Create Branch"
        onSubmit={handleSubmit(onCreateSubmit)}
        isSubmitting={createMutation.isPending}
      >
        {renderFormFields}
      </FormModal>

      <FormModal
        open={isEditModalOpen}
        onClose={handleEditModalClose}
        title="Edit Branch"
        onSubmit={handleSubmit(onEditSubmit)}
        isSubmitting={updateMutation.isPending}
      >
        {renderFormFields}
      </FormModal>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={onDeleteConfirm}
        title="Delete Branch"
        message={`Are you sure you want to delete ${selectedBranch?.name}?`}
        isLoading={deleteMutation.isPending}
      />
    </Box>
  );
}
