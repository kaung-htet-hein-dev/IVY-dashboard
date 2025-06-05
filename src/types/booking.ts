import { Branch } from "./branch";
import { Service } from "./service";

export interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  branch_id: string;
  booked_date: string;
  booked_time: string;
  status: string;
  created_at: string;
  updated_at: string;
  service: Service;
  branch: Branch;
}

export interface BookingResponse {
  code: number;
  data: Booking[];
  message: string;
}
