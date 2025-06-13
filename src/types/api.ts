import { AxiosError } from "axios";

export type ApiErrorResponse<T = any> = AxiosError<{
  code: number;
  message: string;
  data?: T;
}>;

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
