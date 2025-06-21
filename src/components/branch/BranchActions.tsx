import { Branch } from "@/types/branch";
import { TableActions } from "@/components/common/TableActions";

interface BranchActionsProps {
  branch: Branch;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const BranchActions = ({
  onView,
  onEdit,
  onDelete
}: BranchActionsProps) => {
  return <TableActions onView={onView} onEdit={onEdit} onDelete={onDelete} />;
};
