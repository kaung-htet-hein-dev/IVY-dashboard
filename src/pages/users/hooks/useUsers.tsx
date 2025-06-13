import { User } from "@/types/user";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData
} from "@tanstack/react-query";
import { createColumnHelper, PaginationState } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import { UserActions } from "../components/UserActions";
import { useNotification } from "@/hooks/useNotification";
import { ApiErrorResponse } from "@/types/api";
import useUserService from "./useUserService";
import { showErrorToastWithMessage } from "@/utils/error";

const columnHelper = createColumnHelper<User>();

type FormState = {
  isOpen: boolean;
  user: User | null;
  isLoading: boolean;
};

type DeleteState = {
  isOpen: boolean;
  user: User | null;
  isLoading: boolean;
};

export const useUsers = () => {
  const userService = useUserService();
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const [formState, setFormState] = useState<FormState>({
    isOpen: false,
    user: null,
    isLoading: false
  });
  const [deleteState, setDeleteState] = useState<DeleteState>({
    isOpen: false,
    user: null,
    isLoading: false
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", pagination],
    queryFn: () => userService.getUsers(pagination),
    placeholderData: keepPreviousData
  });

  const updateMutation = useMutation<
    void,
    ApiErrorResponse,
    Partial<User> & {
      id: string;
    }
  >({
    mutationFn: userService.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showNotification("User updated successfully", "success");
      handleCloseForm();
    },
    onError: (error) => {
      showErrorToastWithMessage(error);
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  });

  const deleteMutation = useMutation<void, ApiErrorResponse, string>({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showNotification("User deleted successfully", "success");
      handleCancelDelete();
    },
    onError: (error) => {
      showErrorToastWithMessage(error);
      setDeleteState((prev) => ({ ...prev, isLoading: false }));
    }
  });

  const handleView = (user: User) => {
    // Implement view logic if needed
    console.log("View user:", user);
  };

  const handleEdit = (user: User) => {
    setFormState({
      isOpen: true,
      user,
      isLoading: false
    });
  };

  const handleDelete = (user: User) => {
    setDeleteState({
      isOpen: true,
      user,
      isLoading: false
    });
  };

  const handleCloseForm = () => {
    setFormState({
      isOpen: false,
      user: null,
      isLoading: false
    });
  };

  const handleSubmit = async (data: Partial<User>) => {
    if (!formState.user) return;

    setFormState((prev) => ({ ...prev, isLoading: true }));
    try {
      await updateMutation.mutate({
        id: formState.user.id,
        ...data
      });
    } catch (error) {
      // Error will be handled by mutation's onError
    }
  };

  const handleCancelDelete = () => {
    setDeleteState({
      isOpen: false,
      user: null,
      isLoading: false
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteState.user) return;

    setDeleteState((prev) => ({ ...prev, isLoading: true }));
    try {
      await deleteMutation.mutate(deleteState.user.id);
    } catch (error) {
      // Error will be handled by mutation's onError
    }
  };

  const columns = [
    columnHelper.accessor("first_name", {
      header: "First Name",
      cell: (props) => props.getValue()
    }),
    columnHelper.accessor("last_name", {
      header: "Last Name",
      cell: (props) => props.getValue()
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (props) => props.getValue()
    }),
    columnHelper.accessor("phone_number", {
      header: "Phone Number",
      cell: (props) => props.getValue()
    }),
    columnHelper.accessor("birthday", {
      header: "Birthday",
      cell: (props) => props.getValue()
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: (props) => props.getValue()
    }),
    columnHelper.accessor("verified", {
      header: "Verified",
      cell: (props) => (props.getValue() ? "Yes" : "No")
    }),
    columnHelper.accessor("gender", {
      header: "Gender",
      cell: (props) => props.getValue() || "unkown"
    }),
    columnHelper.accessor("created_at", {
      header: "Created At",
      cell: (props) => format(new Date(props.getValue()), "PPpp")
    }),
    columnHelper.accessor("updated_at", {
      header: "Updated At",
      cell: (props) => format(new Date(props.getValue()), "PPpp")
    }),
    columnHelper.accessor("id", {
      header: "Actions",
      cell: (props) => (
        <UserActions
          user={props.row.original}
          onView={() => handleView(props.row.original)}
          onEdit={() => handleEdit(props.row.original)}
        />
      )
    })
  ];

  return {
    users,
    isLoading,
    columns,
    formState,
    handleCloseForm,
    handleSubmit,
    deleteState,
    handleCancelDelete,
    handleConfirmDelete,
    pagination,
    setPagination
  };
};
