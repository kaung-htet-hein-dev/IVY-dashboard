import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DataTable from "@/components/common/DataTable";
import FormModal from "@/components/common/FormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import api from "@/lib/api";
import { AxiosResponse } from "axios";

interface Service {
  id: string;
  name: string;
  description: string;
  durationMinute: number;
  price: number;
  categoryId: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
}

const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  durationMinute: z.number().min(1, "Duration is required"),
  price: z.number().min(0, "Price must be non-negative"),
  categoryId: z.string().min(1, "Category is required"),
  image: z.string().min(1, "Image URL is required"),
  isActive: z.boolean()
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function ServicesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      isActive: true
    }
  });

  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await api.get<AxiosResponse<Service[]>>(
        "/api/v1/service"
      );
      return response.data;
    }
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<AxiosResponse<Category[]>>(
        "/api/v1/category"
      );
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      const response = await api.post("/api/v1/service", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      enqueueSnackbar("Service created successfully", { variant: "success" });
      handleCreateModalClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to create service",
        { variant: "error" }
      );
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ServiceFormData }) => {
      const response = await api.put(`/api/v1/service/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      enqueueSnackbar("Service updated successfully", { variant: "success" });
      handleEditModalClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to update service",
        { variant: "error" }
      );
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/service/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      enqueueSnackbar("Service deleted successfully", { variant: "success" });
      handleDeleteDialogClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to delete service",
        { variant: "error" }
      );
    }
  });

  const handleCreateModalOpen = () => {
    reset({
      isActive: true
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    reset();
    setIsCreateModalOpen(false);
  };

  const handleEditModalOpen = (service: Service) => {
    setSelectedService(service);
    reset({
      name: service.name,
      description: service.description,
      durationMinute: service.durationMinute,
      price: service.price,
      categoryId: service.categoryId,
      image: service.image,
      isActive: service.isActive
    });
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setSelectedService(null);
    reset();
    setIsEditModalOpen(false);
  };

  const handleDeleteDialogOpen = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setSelectedService(null);
    setIsDeleteDialogOpen(false);
  };

  const onCreateSubmit = (data: ServiceFormData) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: ServiceFormData) => {
    if (selectedService) {
      updateMutation.mutate({ id: selectedService.id, data });
    }
  };

  const onDeleteConfirm = () => {
    if (selectedService) {
      deleteMutation.mutate(selectedService.id);
    }
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name"
    },
    {
      header: "Category",
      accessorKey: "categoryId",
      cell: (info: any) => {
        const category = categories?.data?.find(
          (cat) => cat.id === info.getValue()
        );
        return category?.name || "N/A";
      }
    },
    {
      header: "Duration (min)",
      accessorKey: "durationMinute"
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (info: any) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        }).format(info.getValue())
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: (info: any) => (info.getValue() ? "Active" : "Inactive")
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
        label="Description"
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
        multiline
        rows={3}
        fullWidth
      />
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Duration (minutes)"
          type="number"
          {...register("durationMinute", { valueAsNumber: true })}
          error={!!errors.durationMinute}
          helperText={errors.durationMinute?.message}
          fullWidth
        />
        <TextField
          label="Price"
          type="number"
          {...register("price", { valueAsNumber: true })}
          error={!!errors.price}
          helperText={errors.price?.message}
          fullWidth
        />
      </Box>
      <FormControl error={!!errors.categoryId} fullWidth>
        <InputLabel>Category</InputLabel>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select {...field} label="Category">
              {categories?.data?.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.categoryId && (
          <FormHelperText>{errors.categoryId.message}</FormHelperText>
        )}
      </FormControl>
      <TextField
        label="Image URL"
        {...register("image")}
        error={!!errors.image}
        helperText={errors.image?.message}
        fullWidth
      />
      <FormControlLabel
        control={
          <Controller
            name="isActive"
            control={control}
            render={({ field: { value, ...field } }) => (
              <Switch checked={value} {...field} />
            )}
          />
        }
        label="Active"
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
        <Typography variant="h4">Services</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateModalOpen}
        >
          Add Service
        </Button>
      </Box>

      <DataTable
        data={services?.data || []}
        columns={columns}
        isLoading={isLoading}
      />

      <FormModal
        open={isCreateModalOpen}
        onClose={handleCreateModalClose}
        title="Create Service"
        onSubmit={handleSubmit(onCreateSubmit)}
        isSubmitting={createMutation.isPending}
      >
        {renderFormFields}
      </FormModal>

      <FormModal
        open={isEditModalOpen}
        onClose={handleEditModalClose}
        title="Edit Service"
        onSubmit={handleSubmit(onEditSubmit)}
        isSubmitting={updateMutation.isPending}
      >
        {renderFormFields}
      </FormModal>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={onDeleteConfirm}
        title="Delete Service"
        message={`Are you sure you want to delete ${selectedService?.name}?`}
        isLoading={deleteMutation.isPending}
      />
    </Box>
  );
}
