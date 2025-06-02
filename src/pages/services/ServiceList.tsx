import { Box, Button } from "@mui/material";
import DataTable from "@/components/common/DataTable";
import { Service, Category } from "./useServices";

interface ServiceListProps {
  services: Service[];
  categories: Category[];
  isLoading: boolean;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

export default function ServiceList({
  services,
  categories,
  isLoading,
  onEdit,
  onDelete
}: ServiceListProps) {
  const columns = [
    {
      header: "Name",
      accessorKey: "name"
    },
    {
      header: "Category",
      accessorKey: "categoryId",
      cell: (info: any) => {
        const category = categories.find((cat) => cat.id === info.getValue());
        return category?.name || "N/A";
      }
    },
    {
      header: "Duration (min)",
      accessorKey: "durationMinute"
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (info: any) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        }).format(info.getValue())
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: (info: any) => (info.getValue() ? "Active" : "Inactive")
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

  return <DataTable data={services} columns={columns} isLoading={isLoading} />;
}
