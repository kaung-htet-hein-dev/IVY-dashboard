import {
  useMutation,
  UseMutationOptions,
  useQueryClient
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../axios";
import { ApiError, ApiResponse, MutationParams } from "../types";

type MutationType = "create" | "update" | "delete";

interface UseGenericMutationOptions<TData, TVariables>
  extends Omit<
    UseMutationOptions<ApiResponse<TData>, AxiosError<ApiError>, TVariables>,
    "mutationFn"
  > {
  type: MutationType;
  invalidateQueries?: string[];
}

export function useGenericMutation<TData, TVariables = MutationParams<TData>>(
  endpoint: string,
  options: UseGenericMutationOptions<TData, TVariables>
) {
  const queryClient = useQueryClient();
  const { type, invalidateQueries, ...mutationOptions } = options;

  const mutationFn = async (variables: TVariables) => {
    let response;

    switch (type) {
      case "create":
        response = await axiosInstance.post(endpoint, variables);
        break;
      case "update":
        const updateId = (variables as MutationParams<TData>).id;
        response = await axiosInstance.put(
          `${endpoint}/${updateId}`,
          (variables as MutationParams<TData>).data
        );
        break;
      case "delete":
        const deleteId = variables as unknown as string | number;
        response = await axiosInstance.delete(`${endpoint}/${deleteId}`);
        break;
      default:
        throw new Error(`Invalid mutation type: ${type}`);
    }

    return response.data;
  };

  return useMutation<ApiResponse<TData>, AxiosError<ApiError>, TVariables>({
    mutationFn,
    onSuccess: () => {
      // Invalidate relevant queries after successful mutation
      if (invalidateQueries) {
        invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }
    },
    ...mutationOptions
  });
}

// Example usage:
// const createUser = useGenericMutation<User>('/users', {
//   type: 'create',
//   invalidateQueries: ['users'],
// });
// createUser.mutate({ data: newUser });
//
// const updateUser = useGenericMutation<User>('/users', {
//   type: 'update',
//   invalidateQueries: ['users'],
// });
// updateUser.mutate({ id: userId, data: updatedUser });
//
// const deleteUser = useGenericMutation<User>('/users', {
//   type: 'delete',
//   invalidateQueries: ['users'],
// });
// deleteUser.mutate(userId);
