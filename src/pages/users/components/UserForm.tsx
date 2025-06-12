import { User } from "@/types/user";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  IconButton,
  CircularProgress
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Close } from "@mui/icons-material";

const updateUserSchema = z.object({
  phone_number: z.string().min(1, "Phone number is required"),
  role: z.enum(["ADMIN", "USER"]),
  gender: z.string().min(1, "Gender is required"),
  birthday: z
    .string()
    .min(1, "Birthday is required")
    .regex(
      /^(\d{2})\/(\d{2})\/(\d{4})$/,
      "Birthday must be in dd/mm/yyyy format"
    )
    .refine((date) => {
      const [day, month, year] = date.split("/").map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      const fiveYearsAgo = new Date(
        today.getFullYear() - 5,
        today.getMonth(),
        today.getDate()
      );
      return birthDate <= fiveYearsAgo;
    }, "Age cannot be more than 5 years")
});

type UpdateUserData = z.infer<typeof updateUserSchema>;

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateUserData) => void;
  initialData?: User;
  isLoading?: boolean;
}

export const UserForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false
}: UserFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      phone_number: "",
      role: initialData?.role || "USER",
      gender: initialData?.gender || "",
      birthday: initialData?.birthday || ""
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        phone_number: initialData.phone_number,
        role: initialData.role,
        gender: initialData.gender,
        birthday: initialData.birthday
      });
    }
  }, [initialData, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: UpdateUserData) => {
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
        {initialData ? "Edit User" : "Create User"}
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
            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number"
                  error={!!errors.phone_number}
                  helperText={errors.phone_number?.message}
                  fullWidth
                  disabled={isLoading}
                />
              )}
            />
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormControl
                  error={!!errors.gender}
                  fullWidth
                  disabled={isLoading}
                >
                  <InputLabel>Gender</InputLabel>
                  <Select {...field} label="Gender">
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {errors.gender && (
                    <FormHelperText>{errors.gender.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="birthday"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Birthday (dd/mm/yyyy)"
                  placeholder="24/03/1997"
                  error={!!errors.birthday}
                  helperText={errors.birthday?.message}
                  fullWidth
                  disabled={isLoading}
                />
              )}
            />
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <FormControl
                  error={!!errors.role}
                  fullWidth
                  disabled={isLoading}
                >
                  <InputLabel>Role</InputLabel>
                  <Select {...field} label="Role">
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="USER">User</MenuItem>
                  </Select>
                  {errors.role && (
                    <FormHelperText>{errors.role.message}</FormHelperText>
                  )}
                </FormControl>
              )}
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
            disabled={isLoading || !isDirty}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {initialData ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
