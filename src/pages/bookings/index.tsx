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
  FormHelperText
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { format } from "date-fns";
import DataTable from "@/components/common/DataTable";
import FormModal from "@/components/common/FormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import api from "@/lib/api";
import { AxiosResponse } from "axios";

interface Booking {
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

interface Service {
  id: string;
  name: string;
  durationMinute: number;
}

interface Branch {
  id: string;
  name: string;
}

interface User {
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

type BookingFormData = z.infer<typeof bookingSchema>;

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" }
];

export default function BookingsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors }
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      status: "PENDING"
    }
  });

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await api.get<AxiosResponse<Booking[]>>(
        "/api/v1/booking"
      );
      return response.data;
    }
  });

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await api.get<AxiosResponse<Service[]>>(
        "/api/v1/service"
      );
      return response.data;
    }
  });

  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const response = await api.get<AxiosResponse<Branch[]>>("/api/v1/branch");
      return response.data;
    }
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get<AxiosResponse<User[]>>("/api/v1/user");
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
    reset({
      status: "PENDING"
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    reset();
    setIsCreateModalOpen(false);
  };

  const handleEditModalOpen = (booking: Booking) => {
    setSelectedBooking(booking);
    reset({
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
    reset();
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

  const columns = [
    {
      header: "User",
      accessorKey: "userId",
      cell: (info: any) => {
        const user = users?.data?.find((user) => user.id === info.getValue());
        return user?.name || "N/A";
      }
    },
    {
      header: "Service",
      accessorKey: "serviceId",
      cell: (info: any) => {
        const service = services?.data?.find(
          (service) => service.id === info.getValue()
        );
        return service?.name || "N/A";
      }
    },
    {
      header: "Branch",
      accessorKey: "branchId",
      cell: (info: any) => {
        const branch = branches?.data?.find(
          (branch) => branch.id === info.getValue()
        );
        return branch?.name || "N/A";
      }
    },
    {
      header: "Start Time",
      accessorKey: "startTime",
      cell: (info: any) =>
        format(new Date(info.getValue()), "MMM d, yyyy h:mm a")
    },
    {
      header: "End Time",
      accessorKey: "endTime",
      cell: (info: any) =>
        format(new Date(info.getValue()), "MMM d, yyyy h:mm a")
    },
    {
      header: "Status",
      accessorKey: "status"
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
      <FormControl error={!!errors.userId} fullWidth>
        <InputLabel>User</InputLabel>
        <Controller
          name="userId"
          control={control}
          render={({ field }) => (
            <Select {...field} label="User">
              {users?.data?.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.userId && (
          <FormHelperText>{errors.userId.message}</FormHelperText>
        )}
      </FormControl>

      <FormControl error={!!errors.serviceId} fullWidth>
        <InputLabel>Service</InputLabel>
        <Controller
          name="serviceId"
          control={control}
          render={({ field }) => (
            <Select {...field} label="Service">
              {services?.data?.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.name} ({service.durationMinute} min)
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.serviceId && (
          <FormHelperText>{errors.serviceId.message}</FormHelperText>
        )}
      </FormControl>

      <FormControl error={!!errors.branchId} fullWidth>
        <InputLabel>Branch</InputLabel>
        <Controller
          name="branchId"
          control={control}
          render={({ field }) => (
            <Select {...field} label="Branch">
              {branches?.data?.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.branchId && (
          <FormHelperText>{errors.branchId.message}</FormHelperText>
        )}
      </FormControl>

      <Controller
        name="startTime"
        control={control}
        render={({ field }) => (
          <DateTimePicker
            label="Start Time"
            {...field}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.startTime,
                helperText: errors.startTime?.message
              }
            }}
          />
        )}
      />

      <FormControl error={!!errors.status} fullWidth>
        <InputLabel>Status</InputLabel>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select {...field} label="Status">
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.status && (
          <FormHelperText>{errors.status.message}</FormHelperText>
        )}
      </FormControl>

      <TextField
        label="Notes"
        {...register("notes")}
        error={!!errors.notes}
        helperText={errors.notes?.message}
        multiline
        rows={3}
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
        <Typography variant="h4">Bookings</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateModalOpen}
        >
          Add Booking
        </Button>
      </Box>

      <DataTable
        data={bookings?.data || []}
        columns={columns}
        isLoading={isLoading}
      />

      <FormModal
        open={isCreateModalOpen}
        onClose={handleCreateModalClose}
        title="Create Booking"
        onSubmit={handleSubmit(onCreateSubmit)}
        isSubmitting={createMutation.isPending}
      >
        {renderFormFields}
      </FormModal>

      <FormModal
        open={isEditModalOpen}
        onClose={handleEditModalClose}
        title="Edit Booking"
        onSubmit={handleSubmit(onEditSubmit)}
        isSubmitting={updateMutation.isPending}
      >
        {renderFormFields}
      </FormModal>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={onDeleteConfirm}
        title="Delete Booking"
        message={`Are you sure you want to delete this booking?`}
        isLoading={deleteMutation.isPending}
      />
    </Box>
  );
}
