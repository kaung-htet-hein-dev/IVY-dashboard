import { Booking, BookingResponse } from "@/types/booking";
import { endpoints } from "@/api/endpoints";
import { axiosInstance } from "@/api/axios";
import { BookingFormData } from "@/pages/bookings/types";
import { format } from "date-fns";
import { TimeSlot } from "@/pages/bookings/types";

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

  updateBookingStatus: async (id: string, status: string): Promise<Booking> => {
    const response = await axiosInstance.put<{ data: Booking }>(
      endpoints.booking(id),
      { status }
    );
    return response.data.data;
  }
};
