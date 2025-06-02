import { Box, Button } from "@mui/material";
import DataTable from "@/components/common/DataTable";
import { Booking, Service, Branch, User } from "./useBookings";

interface BookingListProps {
  bookings: Booking[];
  services: Service[];
  branches: Branch[];
  users: User[];
  isLoading: boolean;
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
}

export default function BookingList({
  bookings,
  services,
  branches,
  users,
  isLoading,
  onEdit,
  onDelete
}: BookingListProps) {
  const columns = [
    {
      header: "User",
      accessorKey: "userId",
      cell: (info: any) => {
        const user = users?.find((user) => user.id === info.getValue());
        return user?.name || "N/A";
      }
    },
    {
      header: "Service",
      accessorKey: "serviceId",
      cell: (info: any) => {
        const service = services?.find(
          (service) => service.id === info.getValue()
        );
        return service?.name || "N/A";
      }
    },
    {
      header: "Branch",
      accessorKey: "branchId",
      cell: (info: any) => {
        const branch = branches?.find(
          (branch) => branch.id === info.getValue()
        );
        return branch?.name || "N/A";
      }
    },
    {
      header: "Start Time",
      accessorKey: "startTime"
    },
    {
      header: "End Time",
      accessorKey: "endTime"
    },
    {
      header: "Status",
      accessorKey: "status"
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

  return <DataTable data={bookings} columns={columns} isLoading={isLoading} />;
}
