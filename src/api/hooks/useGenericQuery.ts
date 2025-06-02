import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../axios";
import {
  ApiError,
  ApiResponse,
  PaginatedResponse,
  QueryParams
} from "../types";

interface UseGenericQueryOptions<TData>
  extends Omit<
    UseQueryOptions<TData, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  > {
  params?: QueryParams;
}

export function useGenericQuery<TData>(
  endpoint: string,
  queryKey: string[],
  options?: UseGenericQueryOptions<
    ApiResponse<TData> | PaginatedResponse<TData>
  >
) {
  const { params, ...queryOptions } = options || {};

  return useQuery<
    ApiResponse<TData> | PaginatedResponse<TData>,
    AxiosError<ApiError>
  >({
    queryKey: [...queryKey, params],
    queryFn: async () => {
      const { data } = await axiosInstance.get(endpoint, { params });
      return data;
    },
    ...queryOptions
  });
}

// Example usage:
// const { data, isLoading } = useGenericQuery<User>('/users', ['users'], {
//   params: { page: 1, limit: 10 },
// });
