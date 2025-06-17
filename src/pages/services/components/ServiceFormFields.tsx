import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister
} from "react-hook-form";
import { ServiceFormData } from "../types";
import useCategoryService from "@/pages/categories/hooks/useCategoryService";
import useBranchService from "@/pages/branches/hooks/useBranchService";

interface ServiceFormFieldsProps {
  register: UseFormRegister<ServiceFormData>;
  control: Control<ServiceFormData>;
  errors: FieldErrors<ServiceFormData>;
  disabled?: boolean;
}

export const ServiceFormFields = ({
  register,
  control,
  errors,
  disabled = false
}: ServiceFormFieldsProps) => {
  const categoryService = useCategoryService();
  const branchService = useBranchService();
  const { data: categories, isFetching: categoryFetching } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories()
  });

  const { data: branches, isFetching: branchFetching } = useQuery({
    queryKey: ["branches"],
    queryFn: () => branchService.getBranches({ is_active: true })
  });

  const isLoading = categoryFetching || branchFetching;
  if (isLoading) return null;

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
        label="Description"
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
        fullWidth
        disabled={disabled}
        multiline
        rows={3}
      />

      <TextField
        label="Duration (minutes)"
        type="number"
        {...register("duration_minute", { valueAsNumber: true })}
        error={!!errors.duration_minute}
        helperText={errors.duration_minute?.message}
        fullWidth
        disabled={disabled}
        InputProps={{
          endAdornment: <InputAdornment position="end">min</InputAdornment>
        }}
      />

      <TextField
        label="Price"
        type="number"
        {...register("price", { valueAsNumber: true })}
        error={!!errors.price}
        helperText={errors.price?.message}
        fullWidth
        disabled={disabled}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>
        }}
      />

      <TextField
        label="Image URL"
        {...register("image")}
        error={!!errors.image}
        helperText={errors.image?.message}
        fullWidth
        disabled={disabled}
      />

      <Controller
        name="category_id"
        control={control}
        render={({ field }) => (
          <FormControl
            error={!!errors.category_id}
            disabled={disabled}
            fullWidth
          >
            <InputLabel>Category</InputLabel>
            <Select label="Category" {...field}>
              {categories?.data?.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.category_id && (
              <FormHelperText>{errors.category_id.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      <InputLabel>Branches</InputLabel>
      <FormControl
        component="fieldset"
        error={!!errors.branch_ids}
        disabled={disabled}
      >
        <FormGroup>
          <Controller
            name="branch_ids"
            control={control}
            render={({ field }) => (
              <>
                {branches?.data?.map((branch) => (
                  <FormControlLabel
                    key={branch.id}
                    control={
                      <Checkbox
                        checked={field.value?.includes(branch.id)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...(field.value || []), branch.id]
                            : (field.value || []).filter(
                                (id) => id !== branch.id
                              );
                          field.onChange(newValue);
                        }}
                      />
                    }
                    label={branch.name}
                  />
                ))}
              </>
            )}
          />
        </FormGroup>
        {errors.branch_ids && (
          <FormHelperText>{errors.branch_ids.message}</FormHelperText>
        )}
      </FormControl>

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
