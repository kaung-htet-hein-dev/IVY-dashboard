import { Service } from "@/types/service";
import { TableActions } from "@/components/common/TableActions";

interface ServiceActionsProps {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export const ServiceActions = ({
  onEdit,
  onDelete,
  onView
}: ServiceActionsProps) => {
  return <TableActions onView={onView} onEdit={onEdit} onDelete={onDelete} />;
};
