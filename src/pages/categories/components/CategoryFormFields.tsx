import { TextField, Stack } from "@mui/material";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CategoryFormData } from "../types";

interface CategoryFormFieldsProps {
  register: UseFormRegister<CategoryFormData>;
  errors: FieldErrors<CategoryFormData>;
  disabled?: boolean;
}

export const CategoryFormFields = ({
  register,
  errors,
  disabled = false
}: CategoryFormFieldsProps) => {
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
    </Stack>
  );
};
