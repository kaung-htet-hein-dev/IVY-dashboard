import { User } from "@/types/user";
import { TableActions } from "@/components/common/TableActions";

interface UserActionsProps {
  user: User;
  onView: () => void;
  onEdit: () => void;
  onDelete?: () => void;
}

export const UserActions = ({ onView, onEdit, onDelete }: UserActionsProps) => {
  return <TableActions onView={onView} onEdit={onEdit} onDelete={onDelete} />;
};
