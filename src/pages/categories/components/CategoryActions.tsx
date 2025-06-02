import { Category } from "@/types/category";
import { TableActions } from "@/components/common/TableActions";

interface CategoryActionsProps {
  category: Category;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const CategoryActions = ({
  onView,
  onEdit,
  onDelete
}: CategoryActionsProps) => {
  return <TableActions onView={onView} onEdit={onEdit} onDelete={onDelete} />;
};
