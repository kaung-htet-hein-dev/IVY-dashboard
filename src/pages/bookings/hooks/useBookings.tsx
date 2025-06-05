import { bookingService } from "@/services/bookingService";
import { Booking } from "@/types/booking";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { BookingActions } from "../components/BookingActions";
import { BookingFormData, FormState } from "../types";
import { enqueueSnackbar } from "notistack";

export const useBookings = () => {
  const [filters, setFilters] = useState({
    status: "",
    bookedDate: null as Date | null
  });

  const { data: bookings = [], isLoading: isTableLoading } = useQuery({
    queryKey: ["bookings", filters],
    queryFn: () =>
      bookingService.getBookings({
        status: filters.status || undefined,
        booked_date: filters.bookedDate
          ? format(filters.bookedDate, "dd/MM/yyyy")
          : undefined
      })
  });

  const handleView = (booking: Booking) => {
    console.log("View booking:", booking);
  };

  const handleEdit = (booking: Booking) => {
    console.log("Edit booking:", booking);
  };

  const handleDelete = (booking: Booking) => {
    console.log("Delete booking:", booking);
  };

  const columnHelper = createColumnHelper<Booking>();

  const columns = useMemo<ColumnDef<Booking, any>[]>(
    () => [
      columnHelper.accessor("booked_date", {
        header: "Booking Date"
      }),
      columnHelper.accessor("booked_time", {
        header: "Booking Time"
      }),
      columnHelper.accessor("service.name", {
        header: "Service Name"
      }),
      columnHelper.accessor("branch.name", {
        header: "Branch Name"
      }),
      columnHelper.accessor("status", {
        header: "Status"
      }),
      columnHelper.accessor("created_at", {
        header: "Created At",
        cell: (props) => format(new Date(props.getValue()), "PPpp")
      }),
      columnHelper.accessor("updated_at", {
        header: "Updated At",
        cell: (props) => format(new Date(props.getValue()), "PPpp")
      }),
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <BookingActions
            booking={row.original}
            onView={() => handleView(row.original)}
            onEdit={() => handleEdit(row.original)}
            onDelete={() => handleDelete(row.original)}
          />
        )
      }
    ],
    []
  );

  const [formState, setFormState] = useState<FormState>({
    mode: null,
    isLoading: false
  });

  const queryClient = useQueryClient();

  const { mutate: createBooking, isPending: isCreating } = useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      enqueueSnackbar("Booking created successfully", { variant: "success" });
      handleCloseForm();
    },
    onError: () => {
      enqueueSnackbar("Failed to create booking", { variant: "error" });
    }
  });

  const handleCreate = () => {
    setFormState({ mode: "create", isLoading: false });
  };

  const handleCloseForm = () => {
    setFormState({ mode: null, isLoading: false });
  };

  const handleSubmit = async (data: BookingFormData) => {
    await createBooking(data);
  };

  return {
    bookings,
    isLoading: isTableLoading,
    columns,
    filters,
    onFilterChange: setFilters,
    formState: {
      ...formState,
      isLoading: isCreating
    },
    handleCreate,
    handleCloseForm,
    handleSubmit
  };
};
