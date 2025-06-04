import {
  UseFormRegister,
  FieldErrors,
  Control,
  useWatch
} from "react-hook-form";
import { ServiceFormData } from "../types";
import {
  TextField,
  Stack,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Checkbox,
  FormGroup,
  InputAdornment
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/categoryService";
import { branchService } from "@/services/branchService";

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
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories
  });

  const { data: branches = [] } = useQuery({
    queryKey: ["branches"],
    queryFn: branchService.getBranches
  });

  // Using useWatch to observe branch_ids for controlled component
  const selectedBranches = useWatch({
    control,
    name: "branch_ids",
    defaultValue: []
  });

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

      <FormControl error={!!errors.category_id} disabled={disabled} fullWidth>
        <InputLabel>Category</InputLabel>
        <Select label="Category" {...register("category_id")}>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        {errors.category_id && (
          <FormHelperText>{errors.category_id.message}</FormHelperText>
        )}
      </FormControl>

      <InputLabel>Branches</InputLabel>
      <FormControl
        component="fieldset"
        error={!!errors.branch_ids}
        disabled={disabled}
      >
        <FormGroup>
          {branches.map((branch) => (
            <FormControlLabel
              key={branch.id}
              control={
                <Checkbox
                  checked={selectedBranches.includes(branch.id)}
                  {...register("branch_ids")}
                  value={branch.id}
                />
              }
              label={branch.name}
            />
          ))}
        </FormGroup>
        {errors.branch_ids && (
          <FormHelperText>{errors.branch_ids.message}</FormHelperText>
        )}
      </FormControl>

      <FormControlLabel
        control={<Switch {...register("is_active")} disabled={disabled} />}
        label="Active"
      />
    </Stack>
  );
};
