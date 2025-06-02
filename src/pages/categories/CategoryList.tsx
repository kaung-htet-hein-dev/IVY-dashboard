import { Box, Button } from "@mui/material";
import DataTable from "@/components/common/DataTable";
import { Category } from "./useCategories";

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryList({
  categories,
  isLoading,
  onEdit,
  onDelete
}: CategoryListProps) {
  const columns = [
    {
      header: "Name",
      accessorKey: "name"
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

  return (
    <DataTable data={categories} columns={columns} isLoading={isLoading} />
  );
}
