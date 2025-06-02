import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { z } from "zod";
import api from "@/lib/api";

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  branchId: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  durationMinute: number;
}

export interface Branch {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

const bookingSchema = z.object({
  userId: z.string().min(1, "User is required"),
  serviceId: z.string().min(1, "Service is required"),
  branchId: z.string().min(1, "Branch is required"),
  startTime: z.date(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
  notes: z.string().optional()
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" }
];

export function useBookings() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      status: "PENDING"
    }
  });

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await api.get<{ data: Booking[] }>("/api/v1/booking");
      return response.data;
    }
  });

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await api.get<{ data: Service[] }>("/api/v1/service");
      return response.data;
    }
  });

  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const response = await api.get<{ data: Branch[] }>("/api/v1/branch");
      return response.data;
    }
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get<{ data: User[] }>("/api/v1/user");
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const selectedService = services?.data?.find(
        (service) => service.id === data.serviceId
      );
      const endTime = new Date(data.startTime);
      endTime.setMinutes(
        endTime.getMinutes() + (selectedService?.durationMinute || 0)
      );

      const bookingData = {
        ...data,
        startTime: format(data.startTime, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        endTime: format(endTime, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
      };

      const response = await api.post("/api/v1/booking", bookingData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      enqueueSnackbar("Booking created successfully", { variant: "success" });
      handleCreateModalClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to create booking",
        { variant: "error" }
      );
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BookingFormData }) => {
      const selectedService = services?.data?.find(
        (service) => service.id === data.serviceId
      );
      const endTime = new Date(data.startTime);
      endTime.setMinutes(
        endTime.getMinutes() + (selectedService?.durationMinute || 0)
      );

      const bookingData = {
        ...data,
        startTime: format(data.startTime, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        endTime: format(endTime, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
      };

      const response = await api.put(`/api/v1/booking/${id}`, bookingData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      enqueueSnackbar("Booking updated successfully", { variant: "success" });
      handleEditModalClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to update booking",
        { variant: "error" }
      );
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/booking/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      enqueueSnackbar("Booking deleted successfully", { variant: "success" });
      handleDeleteDialogClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to delete booking",
        { variant: "error" }
      );
    }
  });

  const handleCreateModalOpen = () => {
    form.reset({
      status: "PENDING"
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    form.reset();
    setIsCreateModalOpen(false);
  };

  const handleEditModalOpen = (booking: Booking) => {
    setSelectedBooking(booking);
    form.reset({
      userId: booking.userId,
      serviceId: booking.serviceId,
      branchId: booking.branchId,
      startTime: new Date(booking.startTime),
      status: booking.status,
      notes: booking.notes
    });
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setSelectedBooking(null);
    form.reset();
    setIsEditModalOpen(false);
  };

  const handleDeleteDialogOpen = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setSelectedBooking(null);
    setIsDeleteDialogOpen(false);
  };

  const onCreateSubmit = (data: BookingFormData) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: BookingFormData) => {
    if (selectedBooking) {
      updateMutation.mutate({ id: selectedBooking.id, data });
    }
  };

  const onDeleteConfirm = () => {
    if (selectedBooking) {
      deleteMutation.mutate(selectedBooking.id);
    }
  };

  return {
    form,
    bookings: bookings?.data || [],
    services: services?.data || [],
    branches: branches?.data || [],
    users: users?.data || [],
    isLoading,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    selectedBooking,
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
