import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { AxiosResponse } from "axios";

export interface Service {
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

export interface Category {
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

export type ServiceFormData = z.infer<typeof serviceSchema>;

export function useServices() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const form = useForm<ServiceFormData>({
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
    form.reset({
      isActive: true
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    form.reset();
    setIsCreateModalOpen(false);
  };

  const handleEditModalOpen = (service: Service) => {
    setSelectedService(service);
    form.reset({
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
    form.reset();
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

  return {
    form,
    services: services?.data || [],
    categories: categories?.data || [],
    selectedService,
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
