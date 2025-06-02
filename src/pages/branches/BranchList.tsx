import { Box, Button } from "@mui/material";
import DataTable from "@/components/common/DataTable";
import { Branch } from "./useBranches";

interface BranchListProps {
  branches: Branch[];
  isLoading: boolean;
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
}

export default function BranchList({
  branches,
  isLoading,
  onEdit,
  onDelete
}: BranchListProps) {
  const columns = [
    {
      header: "Name",
      accessorKey: "name"
    },
    {
      header: "Location",
      accessorKey: "location"
    },
    {
      header: "Phone Number",
      accessorKey: "phoneNumber"
    },
    {
      header: "Coordinates",
      accessorKey: "longitude",
      cell: (info: any) =>
        `${info.row.original.latitude}, ${info.row.original.longitude}`
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

  return <DataTable data={branches} columns={columns} isLoading={isLoading} />;
}
