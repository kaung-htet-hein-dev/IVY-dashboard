import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TextField
} from "@mui/material";
import { Controller } from "react-hook-form";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  Service,
  Branch,
  User,
  BookingFormData,
  STATUS_OPTIONS
} from "./useBookings";

interface BookingFormProps {
  form: any;
  services: Service[];
  branches: Branch[];
  users: User[];
}

export default function BookingForm({
  form,
  services,
  branches,
  users
}: BookingFormProps) {
  const {
    register,
    control,
    formState: { errors }
  } = form;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
      <FormControl error={!!errors.userId} fullWidth>
        <InputLabel>User</InputLabel>
        <Controller
          name="userId"
          control={control}
          render={({ field }) => (
            <Select {...field} label="User">
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.userId && (
          <FormHelperText>{errors.userId.message}</FormHelperText>
        )}
      </FormControl>

      <FormControl error={!!errors.serviceId} fullWidth>
        <InputLabel>Service</InputLabel>
        <Controller
          name="serviceId"
          control={control}
          render={({ field }) => (
            <Select {...field} label="Service">
              {services.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.name} ({service.durationMinute} min)
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.serviceId && (
          <FormHelperText>{errors.serviceId.message}</FormHelperText>
        )}
      </FormControl>

      <FormControl error={!!errors.branchId} fullWidth>
        <InputLabel>Branch</InputLabel>
        <Controller
          name="branchId"
          control={control}
          render={({ field }) => (
            <Select {...field} label="Branch">
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.branchId && (
          <FormHelperText>{errors.branchId.message}</FormHelperText>
        )}
      </FormControl>

      <Controller
        name="startTime"
        control={control}
        render={({ field }) => (
          <DateTimePicker
            label="Start Time"
            {...field}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.startTime,
                helperText: errors.startTime?.message
              }
            }}
          />
        )}
      />

      <FormControl error={!!errors.status} fullWidth>
        <InputLabel>Status</InputLabel>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select {...field} label="Status">
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.status && (
          <FormHelperText>{errors.status.message}</FormHelperText>
        )}
      </FormControl>

      <TextField
        label="Notes"
        {...register("notes")}
        error={!!errors.notes}
        helperText={errors.notes?.message}
        multiline
        rows={3}
        fullWidth
      />
    </Box>
  );
}
