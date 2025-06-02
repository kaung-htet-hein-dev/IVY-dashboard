import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel
} from "@mui/material";
import { UseFormReturn, Controller } from "react-hook-form";
import { ServiceFormData, Category } from "./useServices";

interface ServiceFormProps {
  form: UseFormReturn<ServiceFormData>;
  categories: Category[];
}

export default function ServiceForm({ form, categories }: ServiceFormProps) {
  const {
    register,
    control,
    formState: { errors }
  } = form;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
      <TextField
        label="Name"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
      />
      <TextField
        label="Description"
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
        multiline
        rows={3}
        fullWidth
      />
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Duration (minutes)"
          type="number"
          {...register("durationMinute", { valueAsNumber: true })}
          error={!!errors.durationMinute}
          helperText={errors.durationMinute?.message}
          fullWidth
        />
        <TextField
          label="Price"
          type="number"
          {...register("price", { valueAsNumber: true })}
          error={!!errors.price}
          helperText={errors.price?.message}
          fullWidth
        />
      </Box>
      <FormControl error={!!errors.categoryId} fullWidth>
        <InputLabel>Category</InputLabel>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select {...field} label="Category">
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.categoryId && (
          <FormHelperText>{errors.categoryId.message}</FormHelperText>
        )}
      </FormControl>
      <TextField
        label="Image URL"
        {...register("image")}
        error={!!errors.image}
        helperText={errors.image?.message}
        fullWidth
      />
      <FormControlLabel
        control={
          <Controller
            name="isActive"
            control={control}
            render={({ field: { value, ...field } }) => (
              <Switch checked={value} {...field} />
            )}
          />
        }
        label="Active"
      />
    </Box>
  );
}
