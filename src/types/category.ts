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
}

export interface SingleCategoryResponse {
  code: number;
  data: Category;
  message: string;
}
