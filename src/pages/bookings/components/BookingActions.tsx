import { Booking } from "@/types/booking";
import { TableActions } from "@/components/common/TableActions";

interface BookingActionsProps {
  booking: Booking;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const BookingActions = ({
  onView,
  onEdit,
  onDelete
}: BookingActionsProps) => {
  return <TableActions onView={onView} onEdit={onEdit} onDelete={onDelete} />;
};
