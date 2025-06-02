import { Box, TextField } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { CategoryFormData } from "./useCategories";

interface CategoryFormProps {
  form: UseFormReturn<CategoryFormData>;
}

export default function CategoryForm({ form }: CategoryFormProps) {
  const {
    register,
    formState: { errors }
  } = form;

  return (
    <Box sx={{ pt: 2 }}>
      <TextField
        label="Name"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
      />
    </Box>
  );
}
