import { Delete, Edit, Visibility } from "@mui/icons-material";
import { IconButton, Stack, Tooltip } from "@mui/material";

interface TableActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete?: () => void;
}

export const TableActions = ({
  onView,
  onEdit,
  onDelete
}: TableActionsProps) => {
  return (
    <Stack direction="row" spacing={1}>
      <Tooltip title="View">
        <IconButton size="small" onClick={onView} color="info">
          <Visibility fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton size="small" onClick={onEdit} color="primary">
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>
      {onDelete && (
        <Tooltip title="Delete">
          <IconButton size="small" onClick={onDelete} color="error">
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};
