import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Service, ServiceFormData } from "@/types/service";
import { useNotification } from "@/hooks/useNotification";
import { ServiceActions } from "../components/ServiceActions";
import { format } from "date-fns";
import { ApiErrorResponse } from "@/types/api";
import { showErrorToastWithMessage } from "@/utils/error";
import useServiceService from "./useServiceService";

interface FormState {
  mode: "create" | "edit" | null;
  service?: Service;
  isLoading?: boolean;
}

interface DeleteState {
  isOpen: boolean;
  service?: Service;
  isLoading?: boolean;
}

export const useServices = () => {
  const serviceService = useServiceService();
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const [formState, setFormState] = useState<FormState>({
    mode: null
  });
  const [deleteState, setDeleteState] = useState<DeleteState>({
    isOpen: false
  });

  const { data: services = [], isLoading: isTableLoading } = useQuery({
    queryKey: ["services"],
    queryFn: serviceService.getServices
  });

  const { mutate: createService, isPending: isCreating } = useMutation<
    Service,
    ApiErrorResponse,
    ServiceFormData
  >({
    mutationFn: serviceService.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      showNotification("Service created successfully", "success");
      handleCloseForm();
    },
    onError: (error) => {
      showErrorToastWithMessage(error);
    }
  });

  const { mutate: updateService, isPending: isUpdating } = useMutation<
    Service,
    ApiErrorResponse,
    { id: string; data: ServiceFormData }
  >({
    mutationFn: ({ id, data }) => serviceService.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      showNotification("Service updated successfully", "success");
      handleCloseForm();
    },
    onError: (error) => {
      showErrorToastWithMessage(error);
    }
  });

  const { mutate: deleteService, isPending: isDeleting } = useMutation<
    void,
    ApiErrorResponse,
    string
  >({
    mutationFn: serviceService.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      showNotification("Service deleted successfully", "success");
      handleCancelDelete();
    },
    onError: (error) => {
      showErrorToastWithMessage(error);
    }
  });

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: "name",
      header: "Name"
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => {
        const desc = getValue<string>();
        return desc.length > 50 ? desc.slice(0, 50) + "..." : desc;
      }
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
      accessorKey: "branches",
      header: "Branches",
      cell: ({ getValue }) => {
        const branches = getValue<Array<{ name: string }>>();
        return branches?.map((branch) => branch.name).join(", ") || "-";
      }
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ getValue }) => (getValue<boolean>() ? "Active" : "Inactive")
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ getValue }) => format(new Date(getValue<string>()), "PPpp")
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ getValue }) => format(new Date(getValue<string>()), "PPpp")
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ServiceActions
          service={row.original}
          onEdit={() => handleEdit(row.original)}
          onDelete={() => handleDelete(row.original)}
          onView={() => {}}
        />
      )
    }
  ];

  const handleCreate = () => {
    setFormState({
      mode: "create",
      isLoading: false
    });
  };

  const handleEdit = async (service: Service) => {
    try {
      setFormState({
        mode: "edit",
        service, // Set initial service data
        isLoading: true
      });
    } catch (error) {
      showNotification("Failed to fetch service details", "error");
      setFormState({
        mode: null,
        isLoading: false
      });
    }
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
      isLoading: false
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
      isOpen: false
    });
  };

  return {
    services,
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
