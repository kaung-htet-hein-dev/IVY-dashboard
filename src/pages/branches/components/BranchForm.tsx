import { Branch } from "@/types/branch";
import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  CircularProgress
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const branchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  longitude: z.string().min(1, "Longitude is required"),
  latitude: z.string().min(1, "Latitude is required"),
  phone_number: z.string().min(1, "Phone number is required")
});

type BranchFormData = z.infer<typeof branchSchema>;

interface BranchFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BranchFormData) => Promise<void>;
  initialData?: Branch;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export const BranchForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
  isLoading = false
}: BranchFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      location: "",
      longitude: "",
      latitude: "",
      phone_number: ""
    }
  });

  // Reset form when initialData changes or when form opens/closes
  useEffect(() => {
    if (open) {
      reset(
        initialData || {
          name: "",
          location: "",
          longitude: "",
          latitude: "",
          phone_number: ""
        }
      );
    }
  }, [open, initialData, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: BranchFormData) => {
    try {
      await onSubmit(data);
      handleClose();
    } catch (error) {
      // Error handling is done in the parent component
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
        {mode === "create" ? "Create Branch" : "Edit Branch"}
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
          <Stack spacing={2}>
            <TextField
              label="Name"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              disabled={isLoading}
              autoFocus
            />
            <TextField
              label="Location"
              {...register("location")}
              error={!!errors.location}
              helperText={errors.location?.message}
              fullWidth
              disabled={isLoading}
            />
            <TextField
              label="Longitude"
              {...register("longitude")}
              error={!!errors.longitude}
              helperText={errors.longitude?.message}
              fullWidth
              disabled={isLoading}
            />
            <TextField
              label="Latitude"
              {...register("latitude")}
              error={!!errors.latitude}
              helperText={errors.latitude?.message}
              fullWidth
              disabled={isLoading}
            />
            <TextField
              label="Phone Number"
              {...register("phone_number")}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
              fullWidth
              disabled={isLoading}
            />
          </Stack>
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
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
