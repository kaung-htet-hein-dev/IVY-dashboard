import { z } from "zod";
import { Booking } from "@/types/booking";

export const bookingFormSchema = z.object({
  service_id: z.string().min(1, "Service is required"),
  branch_id: z.string().min(1, "Branch is required"),
  booked_date: z.date({ required_error: "Booking date is required" }),
  booked_time: z.string().min(1, "Booking time is required")
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

export type FormMode = "create" | "edit" | null;

export interface FormState {
  mode: FormMode;
  booking?: Booking;
  isLoading: boolean;
}

export interface UpdateBookingData {
  status: string;
}

export interface TimeSlot {
  slot: string;
  is_available: boolean;
}
