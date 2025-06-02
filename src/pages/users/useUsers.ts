import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { AxiosResponse } from "axios";

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "ADMIN" | "STAFF" | "USER";
  createdAt: string;
  updatedAt: string;
}

export const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Admin" },
  { value: "STAFF", label: "Staff" },
  { value: "USER", label: "User" }
];

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  role: z.enum(["ADMIN", "STAFF", "USER"], {
    required_error: "Role is required"
  })
});

export type UserFormData = z.infer<typeof userSchema>;

export function useUsers() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "USER"
    }
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get<AxiosResponse<User[]>>("/api/v1/user");
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      const response = await api.post("/api/v1/user", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      enqueueSnackbar("User created successfully", { variant: "success" });
      handleCreateModalClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to create user",
        { variant: "error" }
      );
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UserFormData }) => {
      const response = await api.put(`/api/v1/user/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      enqueueSnackbar("User updated successfully", { variant: "success" });
      handleEditModalClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to update user",
        { variant: "error" }
      );
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/user/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      enqueueSnackbar("User deleted successfully", { variant: "success" });
      handleDeleteDialogClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to delete user",
        { variant: "error" }
      );
    }
  });

  const handleCreateModalOpen = () => {
    form.reset({
      role: "USER"
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    form.reset();
    setIsCreateModalOpen(false);
  };

  const handleEditModalOpen = (user: User) => {
    setSelectedUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role
    });
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setSelectedUser(null);
    form.reset();
    setIsEditModalOpen(false);
  };

  const handleDeleteDialogOpen = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setSelectedUser(null);
    setIsDeleteDialogOpen(false);
  };

  const onCreateSubmit = (data: UserFormData) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: UserFormData) => {
    if (selectedUser) {
      updateMutation.mutate({ id: selectedUser.id, data });
    }
  };

  const onDeleteConfirm = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id);
    }
  };

  return {
    form,
    users: users?.data || [],
    selectedUser,
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
