import { Pagination } from "./api";

export interface Branch {
  id: string;
  name: string;
  location: string;
  longitude: string;
  latitude: string;
  phone_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BranchResponse {
  code: number;
  data: Branch[];
  message: string;
  pagination: Pagination;
}
