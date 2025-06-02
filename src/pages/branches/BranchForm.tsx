import { Box, TextField } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { BranchFormData } from "./useBranches";

interface BranchFormProps {
  form: UseFormReturn<BranchFormData>;
}

export default function BranchForm({ form }: BranchFormProps) {
  const {
    register,
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
        label="Location"
        {...register("location")}
        error={!!errors.location}
        helperText={errors.location?.message}
        fullWidth
      />
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Latitude"
          {...register("latitude")}
          error={!!errors.latitude}
          helperText={errors.latitude?.message}
          fullWidth
        />
        <TextField
          label="Longitude"
          {...register("longitude")}
          error={!!errors.longitude}
          helperText={errors.longitude?.message}
          fullWidth
        />
      </Box>
      <TextField
        label="Phone Number"
        {...register("phoneNumber")}
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber?.message}
        fullWidth
      />
    </Box>
  );
}
