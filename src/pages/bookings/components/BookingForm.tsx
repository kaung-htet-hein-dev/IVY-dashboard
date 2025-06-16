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
  FormHelperText,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { BookingFormData } from "../types";
import { useBookingForm } from "../hooks/useBookingForm";
import { DatePicker } from "@mui/x-date-pickers";
import { useNotification } from "@/hooks/useNotification";

interface BookingFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => Promise<void>;
  isLoading?: boolean;
}

export const BookingForm = ({
  open,
  onClose,
  onSubmit,
  isLoading = false
}: BookingFormProps) => {
  const {
    register,
    handleSubmit,
    errors,
    services,
    selectedService,
    handleServiceChange,
    availableSlots,
    minDate,
    maxDate,
    setValue,
    watch
  } = useBookingForm({ open });
  const { showNotification } = useNotification();

  const handleClose = () => {
    onClose();
  };

  const onFormSubmit = async (data: BookingFormData) => {
    try {
      await onSubmit(data);
      handleClose();
    } catch (error: any) {
      // Error handling is done in the parent component
      showNotification(
        error.response?.data?.message || "Failed to create service",
        "error"
      );
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
        Create Booking
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
          <FormControl
            fullWidth
            margin="normal"
            error={Boolean(errors.service_id)}
          >
            <InputLabel id="service-label">Service</InputLabel>
            <Select
              labelId="service-label"
              label="Service"
              {...register("service_id")}
              onChange={(e) => handleServiceChange(e.target.value as string)}
              disabled={isLoading}
            >
              {services?.data?.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.name}
                </MenuItem>
              ))}
            </Select>
            {errors.service_id && (
              <FormHelperText>{errors.service_id.message}</FormHelperText>
            )}
          </FormControl>

          {selectedService && (
            <FormControl
              fullWidth
              margin="normal"
              error={Boolean(errors.branch_id)}
            >
              <InputLabel id="branch-label">Branch</InputLabel>
              <Select
                labelId="branch-label"
                label="Branch"
                {...register("branch_id")}
                disabled={isLoading}
              >
                {selectedService.branches?.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.branch_id && (
                <FormHelperText>{errors.branch_id.message}</FormHelperText>
              )}
            </FormControl>
          )}

          <FormControl
            fullWidth
            margin="normal"
            error={Boolean(errors.booked_date)}
          >
            <DatePicker
              label="Booking Date"
              value={watch("booked_date")}
              onChange={(date) => date && setValue("booked_date", date)}
              disabled={!selectedService?.branches || isLoading}
              minDate={minDate}
              maxDate={maxDate}
              slotProps={{
                textField: {
                  error: Boolean(errors.booked_date),
                  helperText: errors.booked_date?.message
                }
              }}
            />
          </FormControl>

          {availableSlots.length > 0 && (
            <FormControl
              fullWidth
              margin="normal"
              error={Boolean(errors.booked_time)}
            >
              <FormLabel>Available Time Slots</FormLabel>
              <RadioGroup
                value={watch("booked_time")}
                onChange={(e) => setValue("booked_time", e.target.value)}
              >
                {availableSlots.map(({ slot, is_available }) => (
                  <FormControlLabel
                    key={slot}
                    value={slot}
                    control={<Radio />}
                    label={slot}
                    disabled={!is_available || isLoading}
                  />
                ))}
              </RadioGroup>
              {errors.booked_time && (
                <FormHelperText>{errors.booked_time.message}</FormHelperText>
              )}
            </FormControl>
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Note (Optional)"
            placeholder="Add any additional notes or special requests..."
            multiline
            rows={3}
            {...register("note")}
            error={Boolean(errors.note)}
            helperText={errors.note?.message}
            disabled={isLoading}
          />
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
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
