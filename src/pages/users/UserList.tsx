import { Box, Button } from "@mui/material";
import DataTable from "@/components/common/DataTable";
import { User, ROLE_OPTIONS } from "./useUsers";

interface UserListProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserList({
  users,
  isLoading,
  onEdit,
  onDelete
}: UserListProps) {
  const columns = [
    {
      header: "Name",
      accessorKey: "name"
    },
    {
      header: "Email",
      accessorKey: "email"
    },
    {
      header: "Phone Number",
      accessorKey: "phoneNumber"
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (info: any) => {
        const role = ROLE_OPTIONS.find(
          (option) => option.value === info.getValue()
        );
        return role?.label || info.getValue();
      }
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: (info: any) =>
        new Date(info.getValue()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        })
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (info: any) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onEdit(info.row.original)}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => onDelete(info.row.original)}
          >
            Delete
          </Button>
        </Box>
      )
    }
  ];

  return <DataTable data={users} columns={columns} isLoading={isLoading} />;
}
