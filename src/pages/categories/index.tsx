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

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const categorySchema = z.object({
  name: z.string().min(1, "Name is required")
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CategoryFormData>({
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
    reset();
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    reset();
    setIsCreateModalOpen(false);
  };

  const handleEditModalOpen = (category: Category) => {
    setSelectedCategory(category);
    reset({ name: category.name });
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setSelectedCategory(null);
    reset();
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

  const columns = [
    {
      header: "Name",
      accessorKey: "name"
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: (info: any) =>
        new Date(info.getValue()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        })
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
        <Typography variant="h4">Categories</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateModalOpen}
        >
          Add Category
        </Button>
      </Box>

      <DataTable
        data={categories?.data || []}
        columns={columns}
        isLoading={isLoading}
      />

      <FormModal
        open={isCreateModalOpen}
        onClose={handleCreateModalClose}
        title="Create Category"
        onSubmit={handleSubmit(onCreateSubmit)}
        isSubmitting={createMutation.isPending}
      >
        <Box sx={{ pt: 2 }}>
          <TextField
            label="Name"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
          />
        </Box>
      </FormModal>

      <FormModal
        open={isEditModalOpen}
        onClose={handleEditModalClose}
        title="Edit Category"
        onSubmit={handleSubmit(onEditSubmit)}
        isSubmitting={updateMutation.isPending}
      >
        <Box sx={{ pt: 2 }}>
          <TextField
            label="Name"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
          />
        </Box>
      </FormModal>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={onDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete ${selectedCategory?.name}?`}
        isLoading={deleteMutation.isPending}
      />
    </Box>
  );
}
