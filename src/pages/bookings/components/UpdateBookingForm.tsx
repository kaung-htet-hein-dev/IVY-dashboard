import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Booking } from "@/types/booking";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

const updateBookingSchema = z.object({
  status: z.string().min(1, "Status is required")
});

export type UpdateBookingFormData = z.infer<typeof updateBookingSchema>;

interface UpdateBookingFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateBookingFormData) => Promise<void>;
  booking?: Booking;
  isLoading?: boolean;
}

export const UpdateBookingForm = ({
  open,
  onClose,
  onSubmit,
  booking,
  isLoading = false
}: UpdateBookingFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UpdateBookingFormData>({
    resolver: zodResolver(updateBookingSchema),
    defaultValues: {
      status: booking?.status || ""
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: UpdateBookingFormData) => {
    try {
      await onSubmit(data);
      console.log("Booking status updated:", data);
      handleClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isLoading}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        Update Booking Status
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
          disabled={isLoading}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent dividers>
          <FormControl fullWidth margin="normal" error={Boolean(errors.status)}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              {...register("status")}
              disabled={isLoading}
            >
              {BOOKING_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
            {errors.status && (
              <FormHelperText>{errors.status.message}</FormHelperText>
            )}
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
