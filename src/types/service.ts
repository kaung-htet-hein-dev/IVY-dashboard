import { Pagination } from "./api";
import { Branch } from "./branch";
import { Category } from "./category";

export interface Service {
  id: string;
  name: string;
  description: string;
  duration_minute: number;
  price: number;
  category_id: string;
  category: Category;
  image: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  branches: Array<Branch>;
  branch_ids: string[];
}

export interface ServicesResponse {
  code: number;
  data: Service[];
  message: string;
  pagination: Pagination;
}

export type FormMode = "create" | "edit";

export interface ServiceFormData {
  name: string;
  description: string;
  duration_minute: number;
  price: number;
  category_id: string;
  image: string;
  is_active: boolean;
  branch_ids: string[];
}
