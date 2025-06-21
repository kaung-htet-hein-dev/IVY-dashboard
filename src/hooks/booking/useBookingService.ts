import { endpoints } from "@/apiClient/endpoints";
import { Booking, BookingResponse } from "@/types/booking";
import { format } from "date-fns";
import { BookingFormData, TimeSlot } from "../../components/booking/types";
import useAxios from "../utility/useAxios";

interface GetBookingsFilters {
  status?: string;
  booked_date?: string;
}

export const useBookingService = () => {
  const { axiosInstance } = useAxios();

  return {
    getBookings: async (
      options: {
        pageIndex: number;
        pageSize: number;
      } = { pageIndex: 0, pageSize: 10 },
      filters?: GetBookingsFilters
    ): Promise<BookingResponse> => {
      const response = await axiosInstance.get<BookingResponse>(
        `${endpoints.bookings}`,
        {
          params: {
            offset: options.pageIndex * options.pageSize,
            limit: options.pageSize,
            status: filters?.status,
            booked_date: filters?.booked_date
          }
        }
      );

      return response.data;
    },

    getBooking: async (id: string): Promise<Booking> => {
      const response = await axiosInstance.get<{ data: Booking }>(
        endpoints.booking(id)
      );
      return response.data.data;
    },

    getAvailableSlots: async (
      date: string,
      branchId: string
    ): Promise<TimeSlot[]> => {
      const response = await axiosInstance.get<{ data: TimeSlot[] }>(
        `${endpoints.bookings}/slots?booked_date=${date}&branch_id=${branchId}`
      );
      return response.data.data;
    },

    createBooking: async (booking: BookingFormData): Promise<Booking> => {
      const formattedBooking = {
        ...booking,
        booked_date: format(booking.booked_date, "dd/MM/yyyy")
      };
      const response = await axiosInstance.post<{ data: Booking }>(
        endpoints.bookings,
        formattedBooking
      );
      return response.data.data;
    },

    updateBookingStatus: async (
      id: string,
      status: string
    ): Promise<Booking> => {
      const response = await axiosInstance.put<{ data: Booking }>(
        endpoints.booking(id),
        { status }
      );
      return response.data.data;
    }
  };
};

export default useBookingService;
