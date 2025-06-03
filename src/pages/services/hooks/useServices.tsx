import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Service, ServiceFormData } from "@/types/service";
import { formatDateTime } from "@/utils/format";
import { useNotification } from "@/hooks/useNotification";
import { TableActions } from "@/components/common/TableActions";
import { axiosInstance } from "@/api/axios";

interface FormState {
  mode: "create" | "edit" | null;
  service: Service | null;
}

interface DeleteState {
  isOpen: boolean;
  service: Service | null;
}

interface ServiceResponse {
  code: number;
  data: Service;
  message: string;
}

export const useServices = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const [formState, setFormState] = useState<FormState>({
    mode: null,
    service: null
  });
  const [deleteState, setDeleteState] = useState<DeleteState>({
    isOpen: false,
    service: null
  });

  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/v1/service");
      return response.data;
    }
  });

  const { mutate: createService, isPending: isCreating } = useMutation<
    ServiceResponse,
    Error,
    ServiceFormData
  >({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/api/v1/service", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      showNotification("Service created successfully", "success");
      handleCloseForm();
    },
    onError: (error: any) => {
      showNotification(
        error.response?.data?.message || "Failed to create service",
        "error"
      );
    }
  });

  const { mutate: updateService, isPending: isUpdating } = useMutation<
    ServiceResponse,
    Error,
    { id: string; data: ServiceFormData }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put(`/api/v1/service/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      showNotification("Service updated successfully", "success");
      handleCloseForm();
    },
    onError: (error: any) => {
      showNotification(
        error.response?.data?.message || "Failed to update service",
        "error"
      );
    }
  });

  const { mutate: deleteService, isPending: isDeleting } = useMutation<
    ServiceResponse,
    Error,
    string
  >({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/api/v1/service/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      showNotification("Service deleted successfully", "success");
      handleCancelDelete();
    },
    onError: (error: any) => {
      showNotification(
        error.response?.data?.message || "Failed to delete service",
        "error"
      );
    }
  });

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: "name",
      header: "Name"
    },
    {
      accessorKey: "description",
      header: "Description"
    },
    {
      accessorKey: "duration_minute",
      header: "Duration (min)",
      cell: ({ getValue }) => `${getValue<number>()} min`
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ getValue }) => `${getValue<number>().toLocaleString()} MMK`
    },
    {
      accessorKey: "category.name",
      header: "Category"
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ getValue }) => (getValue<boolean>() ? "Active" : "Inactive")
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ getValue }) => formatDateTime(getValue<string>())
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <TableActions
            onView={() => handleView(row.original)}
            onEdit={() => handleEdit(row.original)}
            onDelete={() => handleDelete(row.original)}
          />
        );
      }
    }
  ];

  const handleCreate = () => {
    setFormState({
      mode: "create",
      service: null
    });
  };

  const handleView = (service: Service) => {
    setFormState({
      mode: "edit",
      service
    });
  };

  const handleEdit = (service: Service) => {
    setFormState({
      mode: "edit",
      service
    });
  };

  const handleDelete = (service: Service) => {
    setDeleteState({
      isOpen: true,
      service
    });
  };

  const handleCloseForm = () => {
    setFormState({
      mode: null,
      service: null
    });
  };

  const handleSubmit = async (data: ServiceFormData) => {
    if (formState.mode === "create") {
      await createService(data);
    } else if (formState.mode === "edit" && formState.service) {
      await updateService({
        id: formState.service.id,
        data
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteState.service) return;
    await deleteService(deleteState.service.id);
  };

  const handleCancelDelete = () => {
    setDeleteState({
      isOpen: false,
      service: null
    });
  };

  return {
    services: servicesData?.data || [],
    isLoading: isLoadingServices,
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
