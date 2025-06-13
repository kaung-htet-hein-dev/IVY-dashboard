import { Pagination } from "./api";

export interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryResponse {
  code: number;
  data: Category[];
  message: string;
  pagination: Pagination;
}

export interface SingleCategoryResponse {
  code: number;
  data: Category;
  message: string;
}
