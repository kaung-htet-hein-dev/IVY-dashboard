import { Booking, BookingResponse } from "@/types/booking";
import { endpoints } from "@/api/endpoints";
import { axiosInstance } from "@/api/axios";

interface GetBookingsFilters {
  status?: string;
  booked_date?: string;
}

export const bookingService = {
  getBookings: async (filters?: GetBookingsFilters): Promise<Booking[]> => {
    const params = new URLSearchParams();
    if (filters?.status) {
      params.append("status", filters.status);
    }
    if (filters?.booked_date) {
      params.append("booked_date", filters.booked_date);
    }

    const response = await axiosInstance.get<BookingResponse>(
      `${endpoints.bookings}${params.toString() ? `?${params.toString()}` : ""}`
    );
    return response.data.data;
  },

  getBooking: async (id: string): Promise<Booking> => {
    const response = await axiosInstance.get<{ data: Booking }>(
      endpoints.booking(id)
    );
    return response.data.data;
  }
};
