import { TextField, Stack } from "@mui/material";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { BranchFormData } from "../types";

interface BranchFormFieldsProps {
  register: UseFormRegister<BranchFormData>;
  errors: FieldErrors<BranchFormData>;
  disabled?: boolean;
}

export const BranchFormFields = ({
  register,
  errors,
  disabled = false
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
    </Stack>
  );
};
