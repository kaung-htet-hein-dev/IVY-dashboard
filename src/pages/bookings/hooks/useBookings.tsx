import { ApiErrorResponse } from "@/types/api";
import { Booking } from "@/types/booking";
import { getFormattedShowDateTime } from "@/utils/date";
import { showErrorToastWithMessage } from "@/utils/error";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  createColumnHelper,
  PaginationState
} from "@tanstack/react-table";
import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { useMemo, useState } from "react";
import { BookingActions } from "../components/BookingActions";
import { UpdateBookingFormData } from "../components/UpdateBookingForm";
import { BookingFormData, FormState } from "../types";
import useBookingService from "./useBookingService";
import useUserService from "./useUserService";

export const useBookings = () => {
  const bookingService = useBookingService();
  const userService = useUserService();
  const [filters, setFilters] = useState({
    status: "",
    bookedDate: null as Date | null
  });
  const [formState, setFormState] = useState<FormState>({
    mode: null,
    isLoading: false
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [userInfo, setUserInfo] = useState<{
    open: boolean;
    userID: string | null;
  }>({
    userID: null,
    open: false
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["userInfo", userInfo.userID],
    queryFn: () => {
      if (!userInfo.userID) return Promise.resolve(null);
      return userService.getUser(userInfo.userID);
    },
    enabled: !!userInfo.userID
  });

  const { data: bookings, isLoading: isTableLoading } = useQuery({
    queryKey: ["bookings", filters, pagination],
    queryFn: () =>
      bookingService.getBookings(pagination, {
        status: filters.status || undefined,
        booked_date: filters.bookedDate
          ? format(filters.bookedDate, "dd/MM/yyyy")
          : undefined
      })
  });

  const handleView = (booking: Booking) => {
    console.log("View booking:", booking);
    setUserInfo({ open: true, userID: booking.user_id });
  };

  const handleEdit = (booking: Booking) => {
    setFormState({ mode: "edit", isLoading: false, booking });
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
      columnHelper.accessor("note", {
        header: "Note"
      }),
      columnHelper.accessor("created_at", {
        header: "Created At",
        cell: (props) => getFormattedShowDateTime(props.getValue())
      }),
      columnHelper.accessor("updated_at", {
        header: "Updated At",
        cell: (props) => getFormattedShowDateTime(props.getValue())
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

  const queryClient = useQueryClient();

  const { mutate: createBooking, isPending: isCreating } = useMutation<
    Booking,
    ApiErrorResponse,
    BookingFormData
  >({
    mutationFn: bookingService.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      enqueueSnackbar("Booking created successfully", { variant: "success" });
      handleCloseForm();
    },
    onError: (error) => {
      showErrorToastWithMessage(error);
    }
  });

  const { mutate: updateStatus, isPending: isUpdating } = useMutation<
    Booking,
    ApiErrorResponse,
    { id: string; status: string }
  >({
    mutationFn: ({ id, status }) =>
      bookingService.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      enqueueSnackbar("Booking status updated successfully", {
        variant: "success"
      });
      handleCloseForm();
    },
    onError: (error) => {
      showErrorToastWithMessage(error);
    }
  });

  const handleUpdateBooking = async (data: UpdateBookingFormData) => {
    if (!formState.booking) return;

    setFormState((prev) => ({ ...prev, isLoading: true }));

    try {
      await updateStatus({
        id: formState.booking.id,
        status: data.status
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
    handleCloseForm();
  };

  const handleCreate = () => {
    setFormState({ mode: "create", isLoading: false });
  };

  const handleCloseForm = () => {
    setFormState({ mode: null, isLoading: false });
  };

  const handleSubmit = async (
    data: BookingFormData | UpdateBookingFormData
  ) => {
    if (formState.mode === "edit") {
      await handleUpdateBooking(data as UpdateBookingFormData);
    } else {
      await createBooking(data as BookingFormData);
    }
  };

  const handleUserClose = () => {
    setUserInfo({ open: false, userID: null });
  };

  return {
    bookings,
    isLoading: isTableLoading,
    columns,
    filters,
    onFilterChange: setFilters,
    formState: {
      ...formState,
      isLoading: isCreating || isUpdating
    },
    handleCreate,
    handleCloseForm,
    handleSubmit,
    handleUpdateBooking,
    pagination,
    setPagination,
    user,
    isUserLoading,
    userModalOpen: userInfo.open,
    handleUserClose
  };
};
