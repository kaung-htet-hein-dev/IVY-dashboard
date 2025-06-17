import { TextField, Stack, FormControlLabel, Switch } from "@mui/material";
import { UseFormRegister, FieldErrors, Controller } from "react-hook-form";
import { BranchFormData } from "../types";

interface BranchFormFieldsProps {
  register: UseFormRegister<BranchFormData>;
  errors: FieldErrors<BranchFormData>;
  disabled?: boolean;
  control?: any;
}

export const BranchFormFields = ({
  register,
  errors,
  disabled = false,
  control
}: BranchFormFieldsProps) => {
  return (
    <Stack spacing={2}>
      <TextField
        label="Name"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
        disabled={disabled}
        autoFocus
      />
      <TextField
        label="Location"
        {...register("location")}
        error={!!errors.location}
        helperText={errors.location?.message}
        fullWidth
        disabled={disabled}
      />
      <TextField
        label="Longitude"
        {...register("longitude")}
        error={!!errors.longitude}
        helperText={errors.longitude?.message}
        fullWidth
        disabled={disabled}
      />
      <TextField
        label="Latitude"
        {...register("latitude")}
        error={!!errors.latitude}
        helperText={errors.latitude?.message}
        fullWidth
        disabled={disabled}
      />
      <TextField
        label="Phone Number"
        {...register("phone_number")}
        error={!!errors.phone_number}
        helperText={errors.phone_number?.message}
        fullWidth
        disabled={disabled}
      />
      <Controller
        name="is_active"
        control={control}
        render={({ field: { value, ...field } }) => (
          <FormControlLabel
            control={
              <Switch checked={Boolean(value)} {...field} disabled={disabled} />
            }
            label="Active"
          />
        )}
      />
    </Stack>
  );
};
