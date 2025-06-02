import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../axios";
import { ApiError, PaginatedResponse, QueryParams } from "../types";

interface UseInfiniteGenericQueryOptions {
  params?: Omit<QueryParams, "page">;
  enabled?: boolean;
}

export function useInfiniteGenericQuery<TData>(
  endpoint: string,
  queryKey: string[],
  options?: UseInfiniteGenericQueryOptions
) {
  const { params, enabled } = options || {};

  return useInfiniteQuery({
    queryKey: [...queryKey, params],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosInstance.get<PaginatedResponse<TData>>(
        endpoint,
        {
          params: {
            ...params,
            page: pageParam
          }
        }
      );
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResponse<TData>) => {
      if (lastPage.meta.currentPage < lastPage.meta.lastPage) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    enabled
  });
}

// Example usage:
// const {
//   data,
//   isLoading,
//   fetchNextPage,
//   hasNextPage,
//   isFetchingNextPage
// } = useInfiniteGenericQuery<User>('/users', ['users'], {
//   params: { limit: 10 },
// });
