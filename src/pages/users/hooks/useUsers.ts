import { userService } from "@/services/userService";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";

const columnHelper = createColumnHelper<User>();

export const useUsers = () => {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getUsers
  });

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
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
    columnHelper.accessor("role", {
      header: "Role",
      cell: (props) => props.getValue()
    }),
    columnHelper.accessor("create_at", {
      header: "Created At",
      cell: (props) => format(new Date(props.getValue()), "PPpp")
    }),
    columnHelper.accessor("update_at", {
      header: "Updated At",
      cell: (props) => format(new Date(props.getValue()), "PPpp")
    })
  ];

  return {
    users,
    isLoading,
    columns
  };
};
